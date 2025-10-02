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

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            SELECT p.Hinta AS UnitPrice
            FROM ostoskori_rivit o
            JOIN pizzat p ON o.PizzaID = p.PizzaID
            WHERE o.OstoskoriRivitID = :cartRowID
              AND o.OstoskoriID = :cartID
        ");
        $stmt->execute([
            'cartRowID' => $cartRowID,
            'cartID' => $cartID
        ]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            throw new Exception("No matching cart row found.", 404);
        }

        $unitPrice = $row['UnitPrice'];
        $totalPrice = $cartQuantity * $unitPrice;

        $stmt = $pdo->prepare("
            UPDATE ostoskori_rivit
            SET Maara = :quantity, Hinta = :totalPrice
            WHERE OstoskoriRivitID = :id AND OstoskoriID = :cart_id
        ");
        $stmt->execute([
            'id' => $cartRowID,
            'cart_id' => $cartID,
            'quantity' => $cartQuantity,
            'totalPrice' => $totalPrice
        ]);

        if ($stmt->rowCount() === 0) {
            throw new Exception("No changes made to the cart row.", 404);
        }

        $pdo->commit();

        return [
            "message" => "Quantity changed",
            "cartRowID" => $cartRowID,
            "unitPrice" => $unitPrice,
            "totalPrice" => $totalPrice
        ];

    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}
?>
