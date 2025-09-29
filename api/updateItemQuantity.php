<?php

function updateCartItemQuantity($pdo, $input)
{
    $cartRowID = $input['cartRowID'] ?? null;
    $cartID = $_SESSION['cartID'] ?? null;

    if (!$cartRowID || !$cartID) {
        throw new Exception("Missing cartRowID or cartID", 400);
    }

    if (!isset($input['quantity']) || !is_numeric($input['quantity'])) {
        throw new InvalidArgumentException("Quantity must be an integer.", 422);
    }

    $cartQuantity = (int) $input['quantity'];

    if ($cartQuantity < 1 || $cartQuantity > 99) {
        throw new InvalidArgumentException("Quantity must be between 1 and 99.", 422);
    }

    $stmt = $pdo->prepare("UPDATE ostoskori_rivit SET Maara = :quantity WHERE OstoskoriRivitID = :id AND OstoskoriID = :cart_id");
    $stmt->execute([
        'id' => $cartRowID,
        'cart_id' => $cartID,
        'quantity' => $cartQuantity
    ]);
    if ($stmt->rowCount() === 0) {
        throw new Exception("No matching cart row found or quantity unchanged.", 404);
    }

    return ["message" => "Quantity changed", "cartRowID" => $cartRowID];

}