<?php
session_start();
header('Content-Type: application/json');
require '../src/config.php';

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    echo json_encode(['success' => false, 'message' => 'Invalid request method!']);
    exit;
}

// Get session info
$guestToken = $_SESSION['guestToken'] ?? null;
$asiakasID = $_SESSION['userID'] ?? null;

// Debug session info
error_log("FetchCart - Guest token: " . ($guestToken ?? 'NULL'));
error_log("FetchCart - Customer ID: " . ($asiakasID ?? 'NULL'));

if (!$guestToken && !$asiakasID) {
    echo json_encode(['success' => true, 'totalQuantity' => 0, 'items' => []]);
    exit;
}

try {
    // Get the latest cart
    if ($asiakasID) {
        $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE AsiakasID = :asiakasID ORDER BY UpdatedAt DESC LIMIT 1");
        $stmt->execute(['asiakasID' => $asiakasID]);
    } else {
        $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE GuestToken = :guestToken ORDER BY UpdatedAt DESC LIMIT 1");
        $stmt->execute(['guestToken' => $guestToken]);
    }

    $cart = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$cart) {
        error_log("No cart found for user");
        echo json_encode(['success' => true, 'totalQuantity' => 0, 'items' => []]);
        exit;
    }

    $cartID = $cart['OstoskoriID'];
    error_log("Found cart ID: $cartID");

    // If only requesting count (for index page)
    if (isset($_GET['count']) && $_GET['count'] == 1) {
        $stmt = $pdo->prepare("SELECT SUM(Maara) AS kokonaisMaara FROM ostoskori_rivit WHERE OstoskoriID = :OstoskoriID");
        $stmt->execute(['OstoskoriID' => $cartID]);
        $total = $stmt->fetch(PDO::FETCH_ASSOC);

        $totalQuantity = (int) ($total['kokonaisMaara'] ?? 0);
        error_log("Total quantity requested: $totalQuantity");

        echo json_encode([
            'success' => true,
            'totalQuantity' => $totalQuantity
        ]);
        exit;
    }

    // Get cart items with pizza and size details
    $stmt = $pdo->prepare("
        SELECT 
            r.OstoskoriRivitID,
            r.OstoskoriID,
            r.PizzaID,
            r.LisaID,
            r.KokoID,
            r.Maara,
            r.Hinta AS TotalLinePrice,
            p.Nimi,
            p.Hinta AS BasePizzaPrice,
            p.Kuva,
            s.koko AS KokoNimi,
            s.HintaKerroin AS KokoKerroin
        FROM ostoskori_rivit r
        LEFT JOIN pizzat p ON r.PizzaID = p.PizzaID
        LEFT JOIN koot s ON r.KokoID = s.KokoID
        WHERE r.OstoskoriID = :OstoskoriID
        ORDER BY r.OstoskoriRivitID ASC
    ");

    $stmt->execute(['OstoskoriID' => $cartID]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    error_log("Raw cart items found: " . count($items));
    error_log("Raw cart data: " . print_r($items, true));

    if (empty($items)) {
        echo json_encode(['success' => true, 'totalQuantity' => 0, 'items' => []]);
        exit;
    }

    $formattedItems = array_map(function($item) {
        // The Hinta field now contains the total line price (unit price * quantity)
        $totalLinePrice = floatval($item['TotalLinePrice'] ?? 0);
        $quantity = intval($item['Maara'] ?? 1);
        
        // Calculate unit price from total line price
        $unitPrice = $quantity > 0 ? $totalLinePrice / $quantity : 0;

        $formattedItem = [
            'cartID' => $item['OstoskoriRivitID'],
            'PizzaID' => $item['PizzaID'],
            'Nimi' => $item['Nimi'] ?? 'Unknown Pizza',
            'Kuva' => $item['Kuva'],
            'quantity' => $quantity,
            'sizeID' => $item['KokoID'],
            'sizeName' => $item['KokoNimi'] ?? '-',
            'unitPrice' => $unitPrice,
            'totalPrice' => $totalLinePrice,
            'price' => $totalLinePrice // For backward compatibility
        ];

        error_log("Formatted item: " . print_r($formattedItem, true));
        return $formattedItem;
    }, $items);

    // Calculate total cart quantity
    $totalQuantity = array_sum(array_column($formattedItems, 'quantity'));

    error_log("Final formatted items: " . print_r($formattedItems, true));
    error_log("Total cart quantity: $totalQuantity");

    echo json_encode([
        'success' => true,
        'totalQuantity' => $totalQuantity,
        'items' => $formattedItems
    ]);

} catch (Exception $e) {
    error_log("FetchCart error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>