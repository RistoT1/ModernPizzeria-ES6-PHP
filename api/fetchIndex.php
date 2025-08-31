<?php
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}

require_once "../src/config.php";

try {
    $stmt = $pdo->prepare("
        SELECT 
            p.PizzaID,
            p.Nimi AS PizzaNimi,
            p.Pohja,
            p.Tiedot,
            p.Hinta,
            p.Kuva,
            GROUP_CONCAT(a.Nimi SEPARATOR ', ') AS Ainesosat
        FROM Pizzat p
        JOIN pizza_aineosat pa ON p.PizzaID = pa.PizzaID
        JOIN aineosat a ON pa.AinesosaID = a.AinesosaID
        GROUP BY p.PizzaID
        ORDER BY p.PizzaID
    ");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [];
    foreach ($results as $row) {
        $data[] = [
            'PizzaID' => $row['PizzaID'],
            'Nimi' => $row['PizzaNimi'],
            'Pohja' => $row['Pohja'],
            'Tiedot' => $row['Tiedot'],
            'Hinta' => $row['Hinta'],
            'Kuva' => $row['Kuva'],
            'Ainesosat' => $row['Ainesosat']
        ];
    }

    echo json_encode(["data" => $data]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
