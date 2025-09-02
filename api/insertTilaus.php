<?php
session_start();
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}

require_once "../src/config.php";

// Check session cart
if (!isset($_SESSION['cartID']) || empty($_SESSION['cartID'])) {
    echo json_encode(["success" => false, "message" => "No active cart found"]);
    exit;
}

$cartID = $_SESSION['cartID'];

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
    exit;
}

// Required customer fields
$requiredFields = ["Enimi", "Snimi", "email", "puhelin", "osoite", "posti", "kaupunki"];
foreach ($requiredFields as $field) {
    if (!isset($input[$field]) || trim($input[$field]) === "") {
        echo json_encode(["success" => false, "message" => "Missing field: $field"]);
        exit;
    }
}

// Sanitize customer data
$etunimi = htmlspecialchars(trim($input["Enimi"]));
$sukunimi = htmlspecialchars(trim($input["Snimi"]));
$email = htmlspecialchars(trim($input["email"]));
$puhelin = htmlspecialchars(trim($input["puhelin"]));
$osoite = htmlspecialchars(trim($input["osoite"]));
$posti = htmlspecialchars(trim($input["posti"]));
$kaupunki = htmlspecialchars(trim($input["kaupunki"]));


try {
    $pdo->beginTransaction();

    // 1. Insert customer
    $stmt = $pdo->prepare("
        INSERT INTO asiakkaat (Enimi, Snimi, Puh, Email, Osoite, PostiNum, PostiTp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$etunimi, $sukunimi, $puhelin, $email, $osoite, $posti, $kaupunki]);
    $asiakasID = $pdo->lastInsertId();

    // 2. Insert order
    $stmt = $pdo->prepare("
        INSERT INTO tilaukset (AsiakasID, KuljettajaID, TilausPvm, Status, Kokonaishinta, Kommentit)
        VALUES (?, NULL, NOW(), 'Odottaa', 0, NULL)
    ");
    $stmt->execute([$asiakasID]);
    $tilausID = $pdo->lastInsertId();

    // 3. Get cart items
    $stmt = $pdo->prepare("
        SELECT PizzaID, KokoID, Maara, Hinta
        FROM ostoskori_rivit
        WHERE OstoskoriID = ?
    ");
    $stmt->execute([$cartID]);
    $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$cartItems) {
        throw new Exception("Cart is empty");
    }

    // 4. Insert order items
    $stmt = $pdo->prepare("
        INSERT INTO tilausrivit_pizzat (TilausID, PizzaID, KokoID, Maara, Hinta)
        VALUES (?, ?, ?, ?, ?)
    ");
    $totalPrice = 0;
    foreach ($cartItems as $item) {
        $stmt->execute([
            $tilausID,
            $item['PizzaID'],
            $item['KokoID'],
            $item['Maara'],
            $item['Hinta']
        ]);
        $totalPrice += $item['Hinta'] * $item['Maara'];
    }
    $totalPrice = round($totalPrice, 2);

    // 5. Update order total
    $stmt = $pdo->prepare("UPDATE tilaukset SET Kokonaishinta = ? WHERE TilausID = ?");
    $stmt->execute([$totalPrice, $tilausID]);

    // 6. Clear cart in DB
    $stmt = $pdo->prepare("DELETE FROM ostoskori_rivit WHERE OstoskoriID = ?");
    $stmt->execute([$cartID]);

    $stmt = $pdo->prepare("DELETE FROM ostoskori WHERE OstoskoriID = ?");
    $stmt->execute([$cartID]);

    // 7. Commit everything
    $pdo->commit();

    // 8. Clear session cart after successful commit
    unset($_SESSION['cartID']);

    echo json_encode([
        "success" => true,
        "message" => "Order placed successfully",
        "tilausID" => $tilausID,
        "asiakasID" => $asiakasID
    ]);

} catch (Exception $e) {
    $pdo->rollBack();
    error_log("Order error: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Order failed, please try again later."
    ]);
}
