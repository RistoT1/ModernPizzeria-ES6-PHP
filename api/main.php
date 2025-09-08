<?php
header("Content-Type: application/json");
require_once "../src/config.php";
require_once "fetchMenu.php"; // contains fetchKaikki, fetchPizzat, fetchLisat

$method = $_SERVER["REQUEST_METHOD"];

$routes = [
    "GET" => [
        "kaikki" => "fetchKaikki",
        "pizzat" => "fetchPizzat",
        "lisat"  => "fetchLisat"
    ],
    "POST" => [
        "order" => "createOrder",
        "user"  => "createUser"
    ]
];

$input = $method === "GET" ? $_GET : $_POST;

foreach ($routes[$method] ?? [] as $param => $function) {
    if (isset($input[$param])) {
        if (function_exists($function)) {
            $function($pdo); // call the function from fetchMenu.php
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Handler $function not defined"]);
        }
        exit;
    }
}

http_response_code(404);
echo json_encode(["error" => "Unknown endpoint"]);
