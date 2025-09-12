<?php

function fetchCart($pdo)
{
    if (!isset($_SESSION['guestToken'])) {
        $_SESSION['guestToken'] = bin2hex(random_bytes(16));
    }
    $asiakasID = $_SESSION['AsiakasID'] ?? null;
    $guestToken = $_SESSION['guestToken'] ?? null;
    
    if ($asiakasID) {
        $cartID = fetchAsiakasCart($pdo, $asiakasID);
    } else {
        $cartID = fetchGuestCart($pdo, $guestToken);
    }

    if (!$cartID) {
        return ['totalQuantity' => 0, 'items' => []];
    }


    $totalQuantity = fetchCount($pdo, $cartID);
    $includeItems = filter_var($_GET['includeItems'] ?? true, FILTER_VALIDATE_BOOLEAN);
    if (!$includeItems) {
        return ['totalQuantity' => $totalQuantity];
    }
    $cartItems = [];
    $cartItems = fetchCartItems($pdo, $cartID);

    return [
        'totalQuantity' => $totalQuantity,
        'items' => $cartItems
    ];
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
    $formattedItems = formatItems($items);
    return $formattedItems;
}

function formatItems($items)
{
    $formattedItems = array_map(function ($item) {
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


    return $formattedItems;
}
function fetchCount($pdo, $cartID)
{
    $stmt = $pdo->prepare("SELECT SUM(Maara) AS kokonaisMaara FROM ostoskori_rivit WHERE OstoskoriID = :OstoskoriID");
    $stmt->execute(['OstoskoriID' => $cartID]);
    $total = $stmt->fetch(PDO::FETCH_ASSOC);

    return intval($total['kokonaisMaara'] ?? 0);
}

function fetchAsiakasCart($pdo, $asiakasID)
{
    $cartID = fetchCartID($pdo, $asiakasID, null);
    $_SESSION['cartID'] = $cartID;
    return $cartID;
}


function fetchGuestCart($pdo, $guestToken)
{
    // Pass guestToken correctly as second parameter
    $cartID = fetchCartID($pdo, null, $guestToken);
    $_SESSION['cartID'] = $cartID;
    return $cartID;
}

function fetchCartID($pdo, $asiakasID = null, $guestToken = null)
{
    if ($asiakasID) {
        // Logged-in user
        $stmt = $pdo->prepare("
            SELECT OstoskoriID 
            FROM ostoskori 
            WHERE AsiakasID = :asiakasID 
            ORDER BY UpdatedAt DESC 
            LIMIT 1
        ");
        $stmt->execute(['asiakasID' => $asiakasID]);
        $cart = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cart) {
            return $cart['OstoskoriID'];
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO ostoskori (AsiakasID, CreatedAt, UpdatedAt) 
                VALUES (:asiakasID, NOW(), NOW())
            ");
            $stmt->execute(['asiakasID' => $asiakasID]);
            return $pdo->lastInsertId();
        }
    } elseif ($guestToken) {
        // Guest user
        $stmt = $pdo->prepare("
            SELECT OstoskoriID 
            FROM ostoskori 
            WHERE GuestToken = :guestToken 
            ORDER BY UpdatedAt DESC 
            LIMIT 1
        ");
        $stmt->execute(['guestToken' => $guestToken]);
        $cart = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cart) {
            return $cart['OstoskoriID'];
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO ostoskori (GuestToken, CreatedAt, UpdatedAt) 
                VALUES (:guestToken, NOW(), NOW())
            ");
            $stmt->execute(['guestToken' => $guestToken]);
            return $pdo->lastInsertId();
        }
    } else {
        throw new Exception("Either asiakasID or guestToken must be provided");
    }
}

