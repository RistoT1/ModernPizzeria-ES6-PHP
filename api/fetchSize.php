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
        SELECT KokoID, Koko, HintaKerroin, Aktiivinen 
        FROM koot 
        WHERE Aktiivinen = 1 
        ORDER BY KokoID
    ");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [];
    foreach ($results as $row) {
        $data[] = [
            'KokoID' => $row['KokoID'],
            'Nimi' => $row['Koko'],
            'HintaKerroin' => $row['HintaKerroin'],
            'Aktiivinen' => $row['Aktiivinen']
        ];
    }

    echo json_encode(["data" => $data]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>