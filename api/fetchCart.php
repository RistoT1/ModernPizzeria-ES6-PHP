<?php
session_start();
header('Content-Type: application/json');
require '../src/config.php';

// Only allow GET requests
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    echo json_encode(['success' => false, 'message' => 'Invalid request method!']);
    exit;
}

if (!isset($_SESSION['guestToken'])) {
    if (isset($_COOKIE['guestToken'])) {
        $_SESSION['guestToken'] = $_COOKIE['guestToken'];
    } else {
        $token = bin2hex(random_bytes(16));
        setcookie('guestToken', $token, time() + 60*60*24*30, "/"); // 30 days
        $_SESSION['guestToken'] = $token;
    }
}

$guestToken = $_SESSION['guestToken'] ?? null;
$asiakasID = $_SESSION['AsiakasID'] ?? null;
$cartID = $_SESSION['cartID'] ?? null;

try {

    if (!$cartID) {
        if ($asiakasID) {
            // Logged-in user
            $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE AsiakasID = :asiakasID ORDER BY UpdatedAt DESC LIMIT 1");
            $stmt->execute(['asiakasID' => $asiakasID]);
            $cart = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$cart) {
                // Create new cart
                $stmt = $pdo->prepare("INSERT INTO ostoskori (AsiakasID, CreatedAt, UpdatedAt) VALUES (:asiakasID, NOW(), NOW())");
                $stmt->execute(['asiakasID' => $asiakasID]);
                $cartID = $pdo->lastInsertId();
            } else {
                $cartID = $cart['OstoskoriID'];
            }
        } else {
            // Guest user
            $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE GuestToken = :guestToken ORDER BY UpdatedAt DESC LIMIT 1");
            $stmt->execute(['guestToken' => $guestToken]);
            $cart = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$cart) {
                // Create new cart
                $stmt = $pdo->prepare("INSERT INTO ostoskori (GuestToken, CreatedAt, UpdatedAt) VALUES (:guestToken, NOW(), NOW())");
                $stmt->execute(['guestToken' => $guestToken]);
                $cartID = $pdo->lastInsertId();
            } else {
                $cartID = $cart['OstoskoriID'];
            }
        }

        $_SESSION['cartID'] = $cartID;
    }

    if (($_GET['count'] ?? null) == 1) {
        $stmt = $pdo->prepare("SELECT SUM(Maara) AS kokonaisMaara FROM ostoskori_rivit WHERE OstoskoriID = :OstoskoriID");
        $stmt->execute(['OstoskoriID' => $cartID]);
        $total = $stmt->fetch(PDO::FETCH_ASSOC);

        $totalQuantity = (int) ($total['kokonaisMaara'] ?? 0);

        echo json_encode([
            'success' => true,
            'totalQuantity' => $totalQuantity
        ]);
        exit;
    }

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

    if (empty($items)) {
        echo json_encode(['success' => true, 'totalQuantity' => 0, 'items' => []]);
        exit;
    }

    $formattedItems = array_map(function ($item) {
        $totalLinePrice = floatval($item['TotalLinePrice'] ?? 0);
        $quantity = intval($item['Maara'] ?? 1);
        $unitPrice = $quantity > 0 ? $totalLinePrice / $quantity : 0;

        return [
            'cartID' => $item['OstoskoriRivitID'],
            'PizzaID' => $item['PizzaID'],
            'Nimi' => $item['Nimi'] ?? 'Unknown Pizza',
            'Kuva' => $item['Kuva'],
            'quantity' => $quantity,
            'sizeID' => $item['KokoID'],
            'sizeName' => $item['KokoNimi'] ?? '-',
            'unitPrice' => $unitPrice,
            'totalPrice' => $totalLinePrice,
            'price' => $totalLinePrice
        ];
    }, $items);

    $totalQuantity = array_sum(array_column($formattedItems, 'quantity'));

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
        'message' => 'Unable to fetch cart at the moment. Please try again later.'
    ]);
}
