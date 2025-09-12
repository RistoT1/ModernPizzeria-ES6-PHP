<?php
// Determine if HTTPS is used
$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');

// Secure session configuration
ini_set('session.use_strict_mode', '1');
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_secure', $secure ? '1' : '0'); // secure only on HTTPS

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => $secure,
    'httponly' => true,
    'samesite' => 'Lax'
]);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header("Content-Type: application/json");

require_once "../src/config.php";   // your PDO connection
require_once "fetchMenu.php";
require_once "fetchSize.php";
require_once "fetchCart.php";
require_once "addToCart.php";
require_once "loginCheck.php";
require_once "insertUser.php";
require_once "logOut.php";
require_once "statusHelpper.php";

// Handle request
$method = $_SERVER["REQUEST_METHOD"];
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
} else {
    $input = $_GET;
}

$debugFile = __DIR__ . '/debug.log';
file_put_contents(__DIR__ . '/debug.log', "[" . date("Y-m-d H:i:s") . "] SESSION: " . json_encode($_SESSION) . "\n", FILE_APPEND);



// Define routes
$routes = [
    "GET" => [
        "kaikki" => "fetchKaikki",
        "pizzat" => "fetchPizzat",
        "lisat" => "fetchLisat",
        "koko" => "fetchKoot",
        "kori" => "fetchCart"
    ],
    "POST" => [
        "addItem" => "addCartItem",
        "login" => "handleLogin",
        "register" => "handleRegister",
        "logout" => "handleLogout"
    ]
];

try {
    $handled = false;

    foreach ($routes[$method] ?? [] as $param => $function) {
        if (array_key_exists($param, $input)) {
            if (!function_exists($function)) {
                http_response_code(500);
                echo json_encode(apiError("Handler $function not defined"));
                exit;
            }

            $data = $function($pdo, $input);
            echo json_encode(apiSuccess($data));
            $handled = true;
            break;
        }
    }

    if (!$handled) {
        http_response_code(404);
        echo json_encode(apiError("Unknown endpoint"));
    }
} catch (Exception $e) {
    echo json_encode(apiError($e->getMessage(), $e->getCode() ?: 500));
}
