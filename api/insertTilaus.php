<?php
function createOrder($pdo, $input)
{ 
    $cartID = null;
    $asiakasID = $_SESSION['AsiakasID'] ?? null;

    try {
        $cartID = checkSessionCart();
        $guestData = null;

        if (!$asiakasID) {
            $guestData = getGuestInput($input);
        }

        checkCart($pdo, $cartID);
        $asiakasID = getOrCreateCustomer($pdo, $asiakasID, $guestData);
        [$tilausID, $totalPrice] = insertOrder($pdo, $asiakasID, $cartID);

        return [
            "success" => true,
            "tilausID" => $tilausID,
            "asiakasID" => $asiakasID,
            "totalPrice" => $totalPrice
        ];

    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        error_log("Tilausvirhe: " . $e->getMessage());
        return [
            "success" => false,
            "error" => $e->getMessage()
        ];
    }
}

function checkSessionCart()
{
    if (!isset($_SESSION['cartID']) || empty($_SESSION['cartID'])) {
        throw new Exception("Koria ei löydy");
    }
    return $_SESSION['cartID'];
}

function validateLoggedCustomer($pdo, $asiakasID)
{
    $stmt = $pdo->prepare("SELECT 1 FROM asiakkaat WHERE AsiakasID = ? AND Aktiivinen = 1");
    $stmt->execute([$asiakasID]);
    if (!$stmt->fetchColumn()) {
        throw new Exception("Kirjautunutta asiakasta ei löytynyt tai ei ole aktiivinen.");
    }
}

function getGuestInput($input)
{
    if (!isset($input['csrf_token']) || $input['csrf_token'] !== $_SESSION['csrf_token']) {
        throw new Exception("CSRF-tarkistus epäonnistui", 403);
    }

    // Fixed field names to match what's being sent from frontend
    $requiredFields = ["Enimi", "Snimi", "Email", "Puh", "Osoite", "PostiNum", "PostiTp"];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || trim($input[$field]) === "") {
            throw new Exception("Kenttiä puuttuu: $field");
        }
    }

    return [
        "Enimi" => htmlspecialchars(trim($input["Enimi"])),
        "Snimi" => htmlspecialchars(trim($input["Snimi"])),
        "Email" => htmlspecialchars(trim($input["Email"])),  // Fixed: was "email"
        "Puh" => htmlspecialchars(trim($input["Puh"])),     // Fixed: was "puhelin"
        "Osoite" => htmlspecialchars(trim($input["Osoite"])),
        "PostiNum" => htmlspecialchars(trim($input["PostiNum"])), // Fixed: was "posti"
        "PostiTp" => htmlspecialchars(trim($input["PostiTp"]))    // Fixed: was "kaupunki"
    ];
}

function checkCart($pdo, $cartID)
{
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM ostoskori WHERE OstoskoriID = ?");
    $stmt->execute([$cartID]);
    if (!$stmt->fetchColumn()) {
        throw new Exception("Koria ei löydy");
    }

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM ostoskori_rivit WHERE OstoskoriID = ?");
    $stmt->execute([$cartID]);
    if (!$stmt->fetchColumn()) {
        throw new Exception("Kori on tyhjä");
    }
}

function getOrCreateCustomer($pdo, $asiakasID, $guestData = null)
{
    if ($asiakasID) {
        validateLoggedCustomer($pdo, $asiakasID);
        return $asiakasID;
    }

    $stmt = $pdo->prepare("SELECT AsiakasID FROM asiakkaat WHERE Email = ? AND Aktiivinen = 1");
    $stmt->execute([$guestData["Email"]]); // Fixed: was $guestData["email"]
    $existingCustomer = $stmt->fetchColumn();

    if ($existingCustomer) {
        return $existingCustomer;
    }

    $stmt = $pdo->prepare("
        INSERT INTO asiakkaat (Enimi, Snimi, Puh, Email, Osoite, PostiNum, PostiTp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $guestData["Enimi"],
        $guestData["Snimi"],
        $guestData["Puh"],     // Fixed: was $guestData["puhelin"]
        $guestData["Email"],   // Fixed: was $guestData["email"]
        $guestData["Osoite"],  // Fixed: was $guestData["osoite"]
        $guestData["PostiNum"], // Fixed: was $guestData["posti"]
        $guestData["PostiTp"]   // Fixed: was $guestData["kaupunki"]
    ]);

    $newId = $pdo->lastInsertId();
    $_SESSION['AsiakasID'] = $newId;
    return $newId;
}

function insertOrder($pdo, $asiakasID, $cartID)
{
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO tilaukset (AsiakasID, KuljettajaID, TilausPvm, Status, Kokonaishinta, Kommentit)
        VALUES (?, NULL, NOW(), 'Odottaa', 0, NULL)
    ");
    $stmt->execute([$asiakasID]);
    $tilausID = $pdo->lastInsertId();

    $stmt = $pdo->prepare("
        SELECT PizzaID, KokoID, Maara, Hinta
        FROM ostoskori_rivit
        WHERE OstoskoriID = ? AND PizzaID IS NOT NULL
    ");
    $stmt->execute([$cartID]);
    $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$cartItems) {
        throw new Exception("Ei löytynyt kelvollisia pizzatuotteita korista");
    }

    $insertStmt = $pdo->prepare("
        INSERT INTO tilausrivit_pizzat (TilausID, PizzaID, KokoID, Maara, Hinta)
        VALUES (?, ?, ?, ?, ?)
    ");

    $totalPrice = 0;
    foreach ($cartItems as $item) {
        $insertStmt->execute([
            $tilausID,
            $item["PizzaID"],
            $item["KokoID"],
            $item["Maara"],
            $item["Hinta"]
        ]);
        $totalPrice += $item["Hinta"];
    }

    $totalPrice = round($totalPrice, 2);

    $stmt = $pdo->prepare("UPDATE tilaukset SET Kokonaishinta = ? WHERE TilausID = ?");
    $stmt->execute([$totalPrice, $tilausID]);

    $stmt = $pdo->prepare("DELETE FROM ostoskori_rivit WHERE OstoskoriID = ?");
    $stmt->execute([$cartID]);
    $stmt = $pdo->prepare("DELETE FROM ostoskori WHERE OstoskoriID = ?");
    $stmt->execute([$cartID]);

    $pdo->commit();
    unset($_SESSION['cartID']);

    return [$tilausID, $totalPrice];
}
?>