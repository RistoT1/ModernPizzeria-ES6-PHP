<?php
function handleLogout($pdo, $input = []) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    if (!isset($_SESSION['AsiakasID'])) {
        http_response_code(401);
        return ["error" => "User not logged in."];
    }

    // Clear session variables
    $_SESSION = [];

    // Destroy session cookie
    setcookie(session_name(), '', [
        'expires' => time() - 3600,
        'path' => '/',
        'domain' => '', 
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    // Destroy session
    session_destroy();

    return [
        "success" => true,
        "message" => "Logout successful."
    ];
}

