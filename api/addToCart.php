<?php
function addCartItem($pdo, $input)
{
    $pizzaID = intval($input['PizzaID'] ?? 0);
    $quantity = intval($input['Quantity'] ?? 1);
    $sizeID = intval($input['KokoID'] ?? 2);

    file_put_contents(__DIR__ . '/debug.log', "[" . date("Y-m-d H:i:s") . "] SESSION: " . json_encode($_SESSION) . json_encode($input) . "\n", FILE_APPEND);
    if (!$pizzaID || !$quantity || !$sizeID) {
        throw new Exception("Missing required fields: pizzaid, quantity or sizeid", 400);
    }

    if ($quantity < 1 || $quantity > 99) {
        throw new Exception('Quantity must be between 1 and 99', 400);
    }

    $user = getUser(); // registered or guest
    $cartID = getOrCreateCart($pdo, $user);

    $pizza = getPizza($pdo, $pizzaID);
    $size = getSize($pdo, $sizeID);

    $unitPrice = floatval($pizza['Hinta']) * floatval($size['HintaKerroin']);

    $cartItemID = addOrUpdateCartItem($pdo, $cartID, $pizzaID, $sizeID, $quantity, $unitPrice);

    $totalQuantity = fetchCount($pdo, $cartID);

    return [
        'cartID' => $cartID,
        'cartItemID' => $cartItemID,
        'unitPrice' => number_format($unitPrice, 2),
        'quantity' => $quantity,
        'totalCartQuantity' => $totalQuantity,
        'pizzaName' => $pizza['Nimi'],
        'sizeName' => $size['Koko'] ?? 'Unknown'
    ];
}

function getUser()
{
    $asiakasID = $_SESSION['AsiakasID'] ?? null;
    $guestToken = $_SESSION['guestToken'] ?? null;

    if (!$asiakasID) {
        if (!$guestToken && isset($_COOKIE['guestToken'])) {
            $guestToken = $_COOKIE['guestToken'];
            $_SESSION['guestToken'] = $guestToken;
        }
        if (!$guestToken) {
            $guestToken = bin2hex(random_bytes(32));
            setcookie('guestToken', $guestToken, time() + 30 * 24 * 60 * 60, '/');
            $_SESSION['guestToken'] = $guestToken;
        }
    }
    return ['asiakasID' => $asiakasID, 'guestToken' => $guestToken];
}

function getOrCreateCart($pdo, $user)
{
    $asiakasID = $user['asiakasID'];
    $guestToken = $user['guestToken'];

    if ($asiakasID) {
        $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE AsiakasID=:id ORDER BY UpdatedAt DESC LIMIT 1");
        $stmt->execute(['id' => $asiakasID]);
    } else {
        $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE GuestToken=:token ORDER BY UpdatedAt DESC LIMIT 1");
        $stmt->execute(['token' => $guestToken]);
    }
    $cart = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($cart) {
        $cartID = $cart['OstoskoriID'];
        $pdo->prepare("UPDATE ostoskori SET UpdatedAt=NOW() WHERE OstoskoriID=:id")
            ->execute(['id' => $cartID]);
    } else {
        if ($asiakasID) {
            $pdo->prepare("INSERT INTO ostoskori (AsiakasID, CreatedAt, UpdatedAt) VALUES (:id,NOW(),NOW())")
                ->execute(['id' => $asiakasID]);
        } else {
            $pdo->prepare("INSERT INTO ostoskori (GuestToken, CreatedAt, UpdatedAt) VALUES (:token,NOW(),NOW())")
                ->execute(['token' => $guestToken]);
        }
        $cartID = $pdo->lastInsertId();
    }

    $_SESSION['cartID'] = $cartID;
    return $cartID;
}

function getPizza($pdo, $pizzaID)
{
    $stmt = $pdo->prepare("SELECT PizzaID,Nimi,Hinta FROM pizzat WHERE PizzaID=:id AND Aktiivinen=1");
    $stmt->execute(['id' => $pizzaID]);
    $pizza = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$pizza)
        return apiError('Pizza not found');
    return $pizza;
}

function getSize($pdo, $sizeID)
{
    $stmt = $pdo->prepare("SELECT KokoID,Koko,HintaKerroin FROM koot WHERE KokoID=:id AND Aktiivinen=1");
    $stmt->execute(['id' => $sizeID]);
    $size = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$size) {
        // fallback to medium
        $stmt = $pdo->prepare("SELECT KokoID,Koko,HintaKerroin FROM koot WHERE KokoID=2 AND Aktiivinen=1");
        $stmt->execute();
        $size = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$size)
            throw new Exception('No valid pizza sizes available');
    }
    return $size;
}

function addOrUpdateCartItem($pdo, $cartID, $pizzaID, $sizeID, $quantity, $unitPrice)
{
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        SELECT OstoskoriRivitID, Maara 
        FROM ostoskori_rivit 
        WHERE OstoskoriID=:cartID AND PizzaID=:pizzaID AND KokoID=:sizeID
    ");
    $stmt->execute([
        'cartID' => $cartID,
        'pizzaID' => $pizzaID,
        'sizeID' => $sizeID
    ]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($item) {
        $newQty = $item['Maara'] + $quantity;
        if ($newQty > 99) {
            throw new Exception('Maximum quantity exceeded');
        }

        $stmt = $pdo->prepare("UPDATE ostoskori_rivit SET Maara=:q, Hinta=:price WHERE OstoskoriRivitID=:id");
        $stmt->execute(['q' => $newQty, 'price' => $unitPrice * $newQty, 'id' => $item['OstoskoriRivitID']]);
        $cartItemID = $item['OstoskoriRivitID'];
    } else {
        $totalPrice = $unitPrice * $quantity;
        $stmt = $pdo->prepare("
            INSERT INTO ostoskori_rivit (OstoskoriID,PizzaID,KokoID,Maara,Hinta)
            VALUES (:cartID,:pizzaID,:sizeID,:qty,:price)
        ");
        $stmt->execute(['cartID' => $cartID, 'pizzaID' => $pizzaID, 'sizeID' => $sizeID, 'qty' => $quantity, 'price' => $totalPrice]);
        $cartItemID = $pdo->lastInsertId();
    }

    $pdo->commit();
    return $cartItemID;
}


