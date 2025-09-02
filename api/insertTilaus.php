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

//input validointi
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

//tarvittavat kentät
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

// tarkistaa onko ostoskori olemassa
$stmt = $pdo->prepare("SELECT COUNT(*) as count FROM ostoskori WHERE OstoskoriID = ?");
$stmt->execute([$cartID]);
$cartExists = $stmt->fetchColumn();

if (!$cartExists) {
    echo json_encode(["success" => false, "message" => "Koria ei löydy"]);
    exit;
}

// tarkistaa onko korissa tuotteita
$stmt = $pdo->prepare("SELECT COUNT(*) as count FROM ostoskori_rivit WHERE OstoskoriID = ?");
$stmt->execute([$cartID]);
$cartItemCount = $stmt->fetchColumn();

if (!$cartItemCount) {
    echo json_encode(["success" => false, "message" => "Kori on tyhjä"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // Tarkistaa onko asiakas jo olemassa sähköpostin perusteella
    $stmt = $pdo->prepare("SELECT AsiakasID FROM asiakkaat WHERE Email = ? AND Aktiivinen = 1");
    $stmt->execute([$email]);
    $existingCustomer = $stmt->fetchColumn();
    
    if ($existingCustomer) {
        $asiakasID = $existingCustomer;
        error_log("Käytetään olemassa olevaa asiakastunnusta: " . $asiakasID); // logaa käytetyn asiakastunnuksen
    } else {
        // Luo uusi asiakas
        $stmt = $pdo->prepare("
            INSERT INTO asiakkaat (Enimi, Snimi, Puh, Email, Osoite, PostiNum, PostiTp)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $result = $stmt->execute([$etunimi, $sukunimi, $puhelin, $email, $osoite, $posti, $kaupunki]);
        
        if (!$result) {
            throw new Exception("Asiakkaan luominen epäonnistui: " . implode(", ", $stmt->errorInfo()));
        }

        $asiakasID = $pdo->lastInsertId();
        error_log("Luotu uusi asiakastunnus: " . $asiakasID); // logaa uuden asiakastunnuksen
    }

    // Luo tilaus
    $stmt = $pdo->prepare("
        INSERT INTO tilaukset (AsiakasID, KuljettajaID, TilausPvm, Status, Kokonaishinta, Kommentit)
        VALUES (?, NULL, NOW(), 'Odottaa', 0, NULL)
    ");
    $result = $stmt->execute([$asiakasID]);

    if (!$result) {
        throw new Exception("Tilauksen luominen epäonnistui: " . implode(", ", $stmt->errorInfo()));
    }
    
    $tilausID = $pdo->lastInsertId();

    // Hae ostoskorin tuotteet
    $stmt = $pdo->prepare("
        SELECT 
            or_r.PizzaID, 
            or_r.KokoID, 
            or_r.Maara, 
            or_r.Hinta,
            p.Nimi as PizzaNimi,
            k.Koko as KokoNimi
        FROM ostoskori_rivit or_r
        LEFT JOIN pizzat p ON or_r.PizzaID = p.PizzaID
        LEFT JOIN koot k ON or_r.KokoID = k.KokoID
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
        
        $result = $insertStmt->execute([
            $tilausID,
            $item['PizzaID'],
            $item['KokoID'],
            $item['Maara'],
            $item['Hinta']
        ]);
        
        if (!$result) {
            throw new Exception("Tilausrivin lisääminen epäonnistui: " . implode(", ", $insertStmt->errorInfo()));
        }
        
        $totalPrice += $item['Hinta'];
    }
    
    $totalPrice = round($totalPrice, 2);

    // Päivitä tilauksen kokonaishinta
    $stmt = $pdo->prepare("UPDATE tilaukset SET Kokonaishinta = ? WHERE TilausID = ?");
    $result = $stmt->execute([$totalPrice, $tilausID]);
    
    if (!$result) {
        throw new Exception("Tilauksen kokonaishinnan päivitys epäonnistui: " . implode(", ", $stmt->errorInfo()));
    }

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
    error_log("Tilausvirhe: " . $e->getMessage()); // logaa virhe

    echo json_encode([
        "success" => false,
        "message" => "Tilaus epäonnistui: ",
        "debug_info" => [
            "cartID" => $cartID,
            "cartExists" => $cartExists ?? false,
            "cartItemCount" => $cartItemCount ?? 0
        ]
    ]);
}
