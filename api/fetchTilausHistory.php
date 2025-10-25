<?php
function fetchTilausHistory($pdo, $input)
{
    $userId = $_SESSION["AsiakasID"] ?? null;
    if (!$userId) {
        return ['success' => false, 'message' => 'User not logged in'];
    }

    $limit = intval($input['limit'] ?? 3);
    $offset = intval($input['offset'] ?? 0);

    $stmt = $pdo->prepare("
        SELECT TilausID, TilausPvm
        FROM tilaukset
        WHERE AsiakasID = :AsiakasID
        ORDER BY TilausPvm DESC
        LIMIT :limit OFFSET :offset
    ");
    $stmt->bindValue(':AsiakasID', $userId, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $data = [];

    foreach ($orders as $order) {
        $orderID = $order['TilausID'];

        $stmtPizzas = $pdo->prepare("
            SELECT tp.PizzaID, p.Nimi, p.Tiedot, tp.Maara, tp.Hinta AS RiviHinta
            FROM tilausrivit_pizzat tp
            JOIN pizzat p ON tp.PizzaID = p.PizzaID
            WHERE tp.TilausID = :TilausID
        ");
        $stmtPizzas->bindValue(':TilausID', $orderID, PDO::PARAM_INT);
        $stmtPizzas->execute();

        $pizzas = $stmtPizzas->fetchAll(PDO::FETCH_ASSOC);

        $totalHinta = 0;
        $totalMaara = 0;
        foreach ($pizzas as &$pizza) {
            $totalHinta += (float)$pizza['RiviHinta'] * (int)$pizza['Maara'];
            $totalMaara += (int)$pizza['Maara'];
        }

        $data[] = [
            'TilausID' => $orderID,
            'TilausPvm' => $order['TilausPvm'],
            'Pizzat' => $pizzas,
            'YhteensaHinta' => $totalHinta,
            'YhteensaMaara' => $totalMaara
        ];
    }

    return $data;
    
}
?>
