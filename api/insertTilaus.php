<?php
session_start();
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Virheellinen method"]);
    exit;
}

require_once "../src/config.php";

// tarkista session ostoskori
if (!isset($_SESSION['cartID']) || empty($_SESSION['cartID'])) {
    echo json_encode(["success" => false, "message" => "Koria ei löydy"]);
    exit;
}

$cartID = $_SESSION['cartID'];
$asiakasID = $_SESSION['AsiakasID'] ?? null;

try {

    if ($asiakasID) {
        // Asiakas on kirjautunut → haetaan tiedot DB:stä
        $stmt = $pdo->prepare("SELECT 1 FROM asiakkaat WHERE AsiakasID = ? AND Aktiivinen = 1");
        $stmt->execute([$asiakasID]);

        if (!$stmt->fetchColumn()) {
            throw new Exception("Kirjautunutta asiakasta ei löytynyt tai ei ole aktiivinen.");
        }

    } else {
        // Vierasasiakas → tarkistetaan input
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            echo json_encode(["success" => false, "message" => "Virheellinen input"]);
            exit;
        }

        if (!isset($input['csrf_token']) || $input['csrf_token'] !== $_SESSION['csrf_token']) {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "CSRF-tarkistus epäonnistui"]);
            exit;
        }

        // tarvittavat kentät
        $requiredFields = ["Enimi", "Snimi", "email", "puhelin", "osoite", "posti", "kaupunki"];
        foreach ($requiredFields as $field) {
            if (!isset($input[$field]) || trim($input[$field]) === "") {
                echo json_encode(["success" => false, "message" => "Kenttiä puuttuu: $field"]);
                exit;
            }
        }

        $etunimi = htmlspecialchars(trim($input["Enimi"]));
        $sukunimi = htmlspecialchars(trim($input["Snimi"]));
        $email = htmlspecialchars(trim($input["email"]));
        $puhelin = htmlspecialchars(trim($input["puhelin"]));
        $osoite = htmlspecialchars(trim($input["osoite"]));
        $posti = htmlspecialchars(trim($input["posti"]));
        $kaupunki = htmlspecialchars(trim($input["kaupunki"]));
    }

    // tarkistaa onko ostoskori olemassa
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM ostoskori WHERE OstoskoriID = ?");
    $stmt->execute([$cartID]);
    if (!$stmt->fetchColumn()) {
        echo json_encode(["success" => false, "message" => "Koria ei löydy"]);
        exit;
    }

    // tarkistaa onko korissa tuotteita
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM ostoskori_rivit WHERE OstoskoriID = ?");
    $stmt->execute([$cartID]);
    if (!$stmt->fetchColumn()) {
        echo json_encode(["success" => false, "message" => "Kori on tyhjä"]);
        exit;
    }

    //aloittaa siirrot
    $pdo->beginTransaction();

    if (!$asiakasID) {
        // Vierasasiakas → luodaan tai haetaan asiakas emailin perusteella
        $stmt = $pdo->prepare("SELECT AsiakasID FROM asiakkaat WHERE Email = ? AND Aktiivinen = 1");
        $stmt->execute([$email]);
        $existingCustomer = $stmt->fetchColumn();

        if ($existingCustomer) {
            $asiakasID = $existingCustomer;
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO asiakkaat (Enimi, Snimi, Puh, Email, Osoite, PostiNum, PostiTp)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $result = $stmt->execute([$etunimi, $sukunimi, $puhelin, $email, $osoite, $posti, $kaupunki]);

            if (!$result) {
                throw new Exception("Asiakkaan luominen epäonnistui: " . implode(", ", $stmt->errorInfo()));
            }

            $asiakasID = $pdo->lastInsertId();
            $_SESSION['AsiakasID'] = $asiakasID; // optionally "log in" new guest
            error_log("Luotu uusi asiakastunnus: " . $asiakasID);
        }
    }

    // Luo tilaus
    $stmt = $pdo->prepare("
        INSERT INTO tilaukset (AsiakasID, KuljettajaID, TilausPvm, Status, Kokonaishinta, Kommentit)
        VALUES (?, NULL, NOW(), 'Odottaa', 0, NULL)
    ");
    $stmt->execute([$asiakasID]);
    $tilausID = $pdo->lastInsertId();

    // Hae ostoskorin tuotteet
    $stmt = $pdo->prepare("
        SELECT 
            or_r.PizzaID, 
            or_r.KokoID, 
            or_r.Maara, 
            or_r.Hinta
        FROM ostoskori_rivit or_r
        WHERE or_r.OstoskoriID = ? AND or_r.PizzaID IS NOT NULL
    ");
    $stmt->execute([$cartID]);
    $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$cartItems) {
        throw new Exception("Ei löytynyt kelvollisia pizzatuotteita korista");
    }

    // Lisää tilauksen rivit
    $insertStmt = $pdo->prepare("
        INSERT INTO tilausrivit_pizzat (TilausID, PizzaID, KokoID, Maara, Hinta)
        VALUES (?, ?, ?, ?, ?)
    ");

    $totalPrice = 0;
    foreach ($cartItems as $item) {
        $insertStmt->execute([
            $tilausID,
            $item['PizzaID'],
            $item['KokoID'],
            $item['Maara'],
            $item['Hinta']
        ]);
        $totalPrice += $item['Hinta'];
    }

    $totalPrice = round($totalPrice, 2);

    // Päivitä tilauksen kokonaishinta
    $stmt = $pdo->prepare("UPDATE tilaukset SET Kokonaishinta = ? WHERE TilausID = ?");
    $stmt->execute([$totalPrice, $tilausID]);

    // Tyhjennä kori
    $stmt = $pdo->prepare("DELETE FROM ostoskori_rivit WHERE OstoskoriID = ?");
    $stmt->execute([$cartID]);
    $stmt = $pdo->prepare("DELETE FROM ostoskori WHERE OstoskoriID = ?");
    $stmt->execute([$cartID]);

    // Vahvista transaktio
    $pdo->commit();

    // Tyhjennä session ostoskori
    unset($_SESSION['cartID']);

    echo json_encode([
        "success" => true,
        "message" => "Tilaus onnistui",
        "tilausID" => $tilausID,
        "asiakasID" => $asiakasID,
        "totalPrice" => $totalPrice
    ]);

} catch (Exception $e) {
    $pdo->rollBack();
    error_log("Tilausvirhe: " . $e->getMessage());

    echo json_encode([
        "success" => false,
        "message" => "Tilaus epäonnistui",
        "debug_info" => [
            "cartID" => $cartID,
            "asiakasID" => $asiakasID ?? null
        ]
    ]);
}
