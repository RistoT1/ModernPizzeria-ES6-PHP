<?php
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["error"=> "Invalid request method"]);
}
require_once "../src/config.php";

try {
    $stmt = $pdo->prepare("SELECT * from Pizzat");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["data" => $result]);
} 
catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error"=> $e->getMessage()]);
}

?>