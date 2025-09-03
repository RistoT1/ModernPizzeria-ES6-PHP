<?php
session_start();
header('Content-Type: application/json');
require '../src/config.php'; 

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'message' => 'Invalid request method!']);
    exit;
}

// Input validation and sanitization
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

$pizzaID = intval($input['pizzaID'] ?? 0);
$quantity = intval($input['quantity'] ?? 1);
$sizeID = intval($input['size'] ?? 2);

// Validate required fields
if (!$pizzaID || !$quantity) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields: pizzaID and quantity']);
    exit;
}

// Validate quantity range
if ($quantity < 1 || $quantity > 99) {
    echo json_encode(['success' => false, 'message' => 'Quantity must be between 1 and 99']);
    exit;
}

// Get user info
$asiakasID = $_SESSION['AsiakasID'] ?? null;
$guestToken = $_SESSION['guestToken'] ?? null;

if (!$asiakasID) {
    if (!$guestToken && isset($_COOKIE['guestToken'])) {
        $guestToken = $_COOKIE['guestToken'];
        $_SESSION['guestToken'] = $guestToken; // restore to session
    }

    if (!$guestToken) {
        $guestToken = bin2hex(random_bytes(32));
        setcookie('guestToken', $guestToken, time() + (30*24*60*60), "/"); // expires in 30 days
        $_SESSION['guestToken'] = $guestToken;
    }
}
// Debug session info
error_log("Session data: " . print_r($_SESSION, true));
error_log("Guest token: " . ($guestToken ?? 'NULL'));
error_log("Customer ID: " . ($asiakasID ?? 'NULL'));

$pdo->beginTransaction();

try {
    // Validate pizza exists and is active
    $stmt = $pdo->prepare("SELECT PizzaID, Nimi, Hinta FROM pizzat WHERE PizzaID = :pizzaID AND Aktiivinen = 1");
    $stmt->execute(['pizzaID' => $pizzaID]);
    $pizza = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$pizza) {
        throw new Exception('Pizza not found or not available');
    }

    // Validate size exists and is active
    $stmt = $pdo->prepare("SELECT KokoID, HintaKerroin FROM koot WHERE KokoID = :sizeID AND Aktiivinen = 1");
    $stmt->execute(['sizeID' => $sizeID]);
    $size = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$size) {
        // Fallback to default size (medium)
        $sizeID = 2;
        $stmt = $pdo->prepare("SELECT KokoID, HintaKerroin FROM koot WHERE KokoID = :sizeID AND Aktiivinen = 1");
        $stmt->execute(['sizeID' => $sizeID]);
        $size = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$size) {
            throw new Exception('No valid pizza sizes available');
        }
    }

    // Calculate the unit price: base price * size multiplier
    $unitPrice = floatval($pizza['Hinta']) * floatval($size['HintaKerroin']);

    error_log("Pizza: {$pizza['Nimi']}, Base Price: {$pizza['Hinta']}, Size Multiplier: {$size['HintaKerroin']}, Unit Price: $unitPrice");

    // Get or create cart
    $cartID = null;
    
    if ($asiakasID) {
        // For registered users
        $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE AsiakasID = :asiakasID ORDER BY UpdatedAt DESC LIMIT 1");
        $stmt->execute(['asiakasID' => $asiakasID]);
        $cart = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($cart) {
            $cartID = $cart['OstoskoriID'];
            // Update cart timestamp
            $stmt = $pdo->prepare("UPDATE ostoskori SET UpdatedAt = NOW() WHERE OstoskoriID = :cartID");
            $stmt->execute(['cartID' => $cartID]);
        } else {
            // Create new cart for registered user
            $stmt = $pdo->prepare("INSERT INTO ostoskori (AsiakasID) VALUES (:asiakasID)");
            $stmt->execute(['asiakasID' => $asiakasID]);
            $cartID = $pdo->lastInsertId();
        }
    } else {
        // For guest users
        $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE GuestToken = :guestToken ORDER BY UpdatedAt DESC LIMIT 1");
        $stmt->execute(['guestToken' => $guestToken]);
        $cart = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($cart) {
            $cartID = $cart['OstoskoriID'];
            // Update cart timestamp
            $stmt = $pdo->prepare("UPDATE ostoskori SET UpdatedAt = NOW() WHERE OstoskoriID = :cartID");
            $stmt->execute(['cartID' => $cartID]);
        } else {
            // Create new cart for guest
            $stmt = $pdo->prepare("INSERT INTO ostoskori (GuestToken) VALUES (:guestToken)");
            $stmt->execute(['guestToken' => $guestToken]);
            $cartID = $pdo->lastInsertId();
        }
    }
    $_SESSION['cartID'] = $cartID;

    error_log("Using cart ID: $cartID");

    // Check if this exact item already exists in cart (same pizza, same size)
    $stmt = $pdo->prepare("
        SELECT OstoskoriRivitID, Maara 
        FROM ostoskori_rivit 
        WHERE OstoskoriID = :cartID 
        AND PizzaID = :pizzaID 
        AND KokoID = :sizeID 
        AND LisaID IS NULL
    ");
    $stmt->execute([
        'cartID' => $cartID,
        'pizzaID' => $pizzaID,
        'sizeID' => $sizeID
    ]);
    $existingItem = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingItem) {
        // Item exists - update quantity and total price
        $newQuantity = intval($existingItem['Maara']) + $quantity;
        
        if ($newQuantity > 99) {
            throw new Exception('Maximum quantity exceeded (99 per item)');
        }
        
        // Calculate total price for this line item (unit price * total quantity)
        $totalLinePrice = $unitPrice * $newQuantity;
        
        $stmt = $pdo->prepare("
            UPDATE ostoskori_rivit 
            SET Maara = :quantity, Hinta = :price 
            WHERE OstoskoriRivitID = :itemID
        ");
        $stmt->execute([
            'quantity' => $newQuantity,
            'price' => $totalLinePrice,
            'itemID' => $existingItem['OstoskoriRivitID']
        ]);
        
        $cartItemID = $existingItem['OstoskoriRivitID'];
        
        error_log("Updated existing item. ItemID: $cartItemID, New Quantity: $newQuantity, Total Price: $totalLinePrice");
        
    } else {
        // New item - insert with total price for the quantity
        $totalLinePrice = $unitPrice * $quantity;
        
        $stmt = $pdo->prepare("
            INSERT INTO ostoskori_rivit (OstoskoriID, PizzaID, KokoID, Maara, Hinta) 
            VALUES (:cartID, :pizzaID, :sizeID, :quantity, :price)
        ");
        $stmt->execute([
            'cartID' => $cartID,
            'pizzaID' => $pizzaID,
            'sizeID' => $sizeID,
            'quantity' => $quantity,
            'price' => $totalLinePrice
        ]);
        
        $cartItemID = $pdo->lastInsertId();
        
        error_log("Added new item. ItemID: $cartItemID, Quantity: $quantity, Total Price: $totalLinePrice");
    }

    // Get total cart quantity for response
    $stmt = $pdo->prepare("SELECT SUM(Maara) AS totalQuantity FROM ostoskori_rivit WHERE OstoskoriID = :cartID");
    $stmt->execute(['cartID' => $cartID]);
    $totalResult = $stmt->fetch(PDO::FETCH_ASSOC);
    $totalQuantity = intval($totalResult['totalQuantity'] ?? 0);

    $pdo->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Item added to cart successfully',
        'data' => [
            'cartID' => $cartID,
            'cartItemID' => $cartItemID,
            'unitPrice' => number_format($unitPrice, 2),
            'totalLinePrice' => number_format($totalLinePrice ?? ($unitPrice * $quantity), 2),
            'quantity' => $newQuantity ?? $quantity,
            'totalCartQuantity' => $totalQuantity,
            'pizzaName' => $pizza['Nimi'],
            'sizeName' => $size['Koko'] ?? 'Unknown'
        ]
    ]);

} catch (Exception $e) {
    $pdo->rollBack();
    
    // Log error for debugging
    error_log("Cart error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    echo json_encode([
        'success' => false, 
        'message' => $e->getMessage()
    ]);
}
?>