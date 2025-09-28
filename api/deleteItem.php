<?php
function deleteCartItem($pdo, $input) {
    $cartRowID = $input['cartRowID'] ?? null;
    $cartID = $_SESSION['cartID'] ?? null;

    if (!$cartRowID || !$cartID) {
        throw new Exception("Missing cartRowID or cartID", 400);
    }

    $stmt = $pdo->prepare("DELETE FROM ostoskori_rivit WHERE OstoskoriRivitID = :id AND OstoskoriID = :cart_id");
    $stmt->execute([
        'id' => $cartRowID,
        'cart_id' => $cartID
    ]);

    return ["message" => "Item deleted", "cartRowID" => $cartRowID];
}