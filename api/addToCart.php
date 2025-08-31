<?php
session_start();
header('Content-Type: application/json');
require '../src/config.php'; // your PDO/MySQL connection

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
$asiakasID = $_SESSION['userID'] ?? null;
$guestToken = $_SESSION['guestToken'] ?? null;

// Generate guest token if needed
if (!$asiakasID && !$guestToken) {
    $guestToken = bin2hex(random_bytes(32)); // Increased length for better security
    $_SESSION['guestToken'] = $guestToken;
}

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
        $sizeID = 2;
        $stmt = $pdo->prepare("SELECT KokoID, HintaKerroin FROM koot WHERE KokoID = :sizeID AND Aktiivinen = 1");
        $stmt->execute(['sizeID' => $sizeID]);
        $size = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Calculate the final price: base price * size multiplier
    $finalPrice = $pizza['Hinta'] * $size['HintaKerroin'];

    // Get or create cart
    $cartID = null;
    
    if ($asiakasID) {
        // For logged-in users
        $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE AsiakasID = :asiakasID ORDER BY UpdatedAt DESC LIMIT 1");
        $stmt->execute(['asiakasID' => $asiakasID]);
        $cart = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($cart) {
            $cartID = $cart['OstoskoriID'];
            // Update timestamp
            $stmt = $pdo->prepare("UPDATE ostoskori SET UpdatedAt = NOW() WHERE OstoskoriID = :cartID");
            $stmt->execute(['cartID' => $cartID]);
        } else {
            // Create new cart
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
            // Update timestamp
            $stmt = $pdo->prepare("UPDATE ostoskori SET UpdatedAt = NOW() WHERE OstoskoriID = :cartID");
            $stmt->execute(['cartID' => $cartID]);
        } else {
            // Create new cart
            $stmt = $pdo->prepare("INSERT INTO ostoskori (GuestToken) VALUES (:guestToken)");
            $stmt->execute(['guestToken' => $guestToken]);
            $cartID = $pdo->lastInsertId();
        }
    }

    // Check if same pizza with same size already exists in cart
    $stmt = $pdo->prepare("SELECT OstoskoriRivitID, Maara FROM ostoskori_rivit WHERE OstoskoriID = :cartID AND PizzaID = :pizzaID AND KokoID = :sizeID AND LisaID IS NULL");
    $stmt->execute([
        'cartID' => $cartID,
        'pizzaID' => $pizzaID,
        'sizeID' => $sizeID
    ]);
    $existingItem = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingItem) {
        // Update existing item quantity and price
        $newQuantity = $existingItem['Maara'] + $quantity;
        if ($newQuantity > 99) {
            throw new Exception('Maximum quantity (99) exceeded');
        }
        
        $stmt = $pdo->prepare("UPDATE ostoskori_rivit SET Maara = :quantity, Hinta = :price WHERE OstoskoriRivitID = :itemID");
        $stmt->execute([
            'quantity' => $newQuantity,
            'price' => $finalPrice,
            'itemID' => $existingItem['OstoskoriRivitID']
        ]);
        
        $cartItemID = $existingItem['OstoskoriRivitID'];
    } else {
        // Insert new pizza item with calculated price
        $stmt = $pdo->prepare("INSERT INTO ostoskori_rivit (OstoskoriID, PizzaID, KokoID, Maara, Hinta) VALUES (:cartID, :pizzaID, :sizeID, :quantity, :price)");
        $stmt->execute([
            'cartID' => $cartID,
            'pizzaID' => $pizzaID,
            'sizeID' => $sizeID,
            'quantity' => $quantity,
            'price' => $finalPrice
        ]);
        $cartItemID = $pdo->lastInsertId();
    }

    // Get updated cart item count and total value
    $stmt = $pdo->prepare("
        SELECT 
            COUNT(*) as itemCount, 
            COALESCE(SUM(Maara), 0) as totalQuantity,
            COALESCE(SUM(Maara * Hinta), 0) as totalValue
        FROM ostoskori_rivit 
        WHERE OstoskoriID = :cartID
    ");
    $stmt->execute(['cartID' => $cartID]);
    $cartStats = $stmt->fetch(PDO::FETCH_ASSOC);

    $pdo->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Item added to cart successfully',
        'cartID' => $cartID,
        'cartItemID' => $cartItemID,
        'itemCount' => $cartStats['itemCount'],
        'totalQuantity' => $cartStats['totalQuantity'],
        'totalValue' => number_format($cartStats['totalValue'], 2),
        'itemPrice' => number_format($finalPrice, 2)
    ]);

} catch (Exception $e) {
    $pdo->rollBack();
    
    // Log error for debugging (don't expose internal errors to client)
    error_log("Cart error: " . $e->getMessage());
    
    echo json_encode([
        'success' => false, 
        'message' => $e->getMessage()
    ]);
}
?>