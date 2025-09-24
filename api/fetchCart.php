<?php
function fetchCart($pdo)
{
    $headerToken = $_SERVER['HTTP_X_GUEST_TOKEN'] ?? null;
    
    if (empty($headerToken) || $headerToken === 'null') {
        $headerToken = null;
    }

    if (!isset($_SESSION['guestToken']) || empty($_SESSION['guestToken'])) {
        $_SESSION['guestToken'] = $headerToken ?? bin2hex(random_bytes(16));
    }

    $guestToken = $headerToken ?? $_SESSION['guestToken'];
    $asiakasID = $_SESSION['AsiakasID'] ?? null;

    if ($asiakasID) {
        $cartID = fetchAsiakasCart($pdo, $asiakasID);
    } else {
        $cartID = fetchGuestCart($pdo, $guestToken);
    }

    if (!$cartID) {
        return ['totalQuantity' => 0, 'items' => [], 'guestToken' => $guestToken];
    }

    $totalQuantity = fetchCount($pdo, $cartID);

    $includeItems = filter_var($_GET['includeItems'] ?? true, FILTER_VALIDATE_BOOLEAN);
    $items = $includeItems ? fetchCartItems($pdo, $cartID) : [];

    return [
        'totalQuantity' => $totalQuantity,
        'items' => $items,
        'guestToken' => $guestToken,
        'cartID' => $cartID
    ];
}

function fetchGuestCart($pdo, $guestToken)
{
    $cartID = fetchCartID($pdo, null, $guestToken);
    $_SESSION['cartID'] = $cartID;
    $_SESSION['guestToken'] = $guestToken;
    return $cartID;
}

function fetchAsiakasCart($pdo, $asiakasID)
{
    $cartID = fetchCartID($pdo, $asiakasID, null);
    $_SESSION['cartID'] = $cartID;
    return $cartID;
}

function fetchCartID($pdo, $asiakasID = null, $guestToken = null)
{
    if ($asiakasID) {
        $stmt = $pdo->prepare("
            SELECT OstoskoriID 
            FROM ostoskori 
            WHERE AsiakasID = :asiakasID 
            ORDER BY UpdatedAt DESC 
            LIMIT 1
        ");
        $stmt->execute(['asiakasID' => $asiakasID]);
        $cart = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cart) return $cart['OstoskoriID'];

        $stmt = $pdo->prepare("
            INSERT INTO ostoskori (AsiakasID, CreatedAt, UpdatedAt) 
            VALUES (:asiakasID, NOW(), NOW())
        ");
        $stmt->execute(['asiakasID' => $asiakasID]);
        return $pdo->lastInsertId();

    } elseif ($guestToken) {
        $stmt = $pdo->prepare("
            SELECT OstoskoriID 
            FROM ostoskori 
            WHERE GuestToken = :guestToken 
            ORDER BY UpdatedAt DESC 
            LIMIT 1
        ");
        $stmt->execute(['guestToken' => $guestToken]);
        $cart = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cart) return $cart['OstoskoriID'];

        $stmt = $pdo->prepare("
            INSERT INTO ostoskori (GuestToken, CreatedAt, UpdatedAt) 
            VALUES (:guestToken, NOW(), NOW())
        ");
        $stmt->execute(['guestToken' => $guestToken]);
        return $pdo->lastInsertId();
    }
}

function fetchCartItems($pdo, $cartID)
{
    $stmt = $pdo->prepare("
        SELECT 
            r.OstoskoriRivitID,
            r.OstoskoriID,
            r.PizzaID,
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
    return formatItems($items);
}

function fetchCount($pdo, $cartID)
{
    $stmt = $pdo->prepare("SELECT SUM(Maara) AS kokonaisMaara FROM ostoskori_rivit WHERE OstoskoriID = :OstoskoriID");
    $stmt->execute(['OstoskoriID' => $cartID]);
    $total = $stmt->fetch(PDO::FETCH_ASSOC);
    return intval($total['kokonaisMaara'] ?? 0);
}

function formatItems($items)
{
    return array_map(function ($item) {
        $totalLinePrice = floatval($item['TotalLinePrice'] ?? 0);
        $quantity = intval($item['Maara'] ?? 1);
        $unitPrice = $quantity > 0 ? $totalLinePrice / $quantity : 0;

        return [
            'cartRowID' => $item['OstoskoriRivitID'],
            'PizzaID' => $item['PizzaID'],
            'Nimi' => $item['Nimi'] ?? 'Unknown Pizza',
            'Kuva' => $item['Kuva'],
            'quantity' => $quantity,
            'sizeID' => $item['KokoID'],
            'sizeName' => $item['KokoNimi'] ?? '-',
            'unitPrice' => $unitPrice,
            'totalPrice' => $totalLinePrice
        ];
    }, $items);
}