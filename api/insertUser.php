<?php
session_start();

header('Content-Type: application/json');
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Only POST method is allowed."]);
    exit;
}

// CSRF validation
if (!isset($_POST['csrf_token'], $_SESSION['csrf_token']) || 
    !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    http_response_code(403);
    echo json_encode(["error" => "Invalid CSRF token."]);
    exit;
}

// Required fields
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirm_password'] ?? '';

if (!$email || !$password || !$confirmPassword) {
    http_response_code(400);
    echo json_encode(["error" => "Missing form data."]);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email format."]);
    exit;
}

// Validate passwords
if ($password !== $confirmPassword) {
    http_response_code(400);
    echo json_encode(["error" => "Passwords do not match."]);
    exit;
}

if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/", $password)) {
    http_response_code(400);
    echo json_encode(["error" => "Password does not meet strength requirements."]);
    exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

require_once "../src/config.php";

try {
    $stmt = $pdo->prepare("INSERT INTO asiakkaat (Email, PasswordHash) VALUES (:email, :password)");
    $stmt->execute([':email' => $email, ':password' => $hashedPassword]);

    $_SESSION['AsiakasID'] = $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Account created successfully!",
        "redirect" => "../index.php"
    ]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Duplicate email
        http_response_code(409);
        echo json_encode(["error" => "Email already registered."]);
        exit;
    }

    http_response_code(500);
    echo json_encode(["error" => "Database error."]);
    error_log("Database error: " . $e->getMessage());
    exit;
}
