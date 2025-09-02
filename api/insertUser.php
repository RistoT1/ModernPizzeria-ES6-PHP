<?php
session_start();

// Disable direct HTML error output
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json');

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

// Check required fields
if (!isset($_POST["email"], $_POST["password"], $_POST["confirm_password"])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing form data."]);
    exit;
}

require_once "../src/config.php"; // make sure path is correct

$email = trim($_POST["email"]);
$password = $_POST["password"];
$confirmPassword = $_POST["confirm_password"];

// Validate email
if ($email === "") {
    http_response_code(400);
    echo json_encode(["error" => "Please enter an email."]);
    exit;
}

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

$passwordPattern = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/";
if (!preg_match($passwordPattern, $password)) {
    http_response_code(400);
    echo json_encode(["error" => "Password does not meet strength requirements."]);
    exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    $pdo->beginTransaction();

    // Insert new user
    $stmt = $pdo->prepare("INSERT INTO asiakkaat (Email, PasswordHash) VALUES (:email, :password)");
    $stmt->execute([
        ':email' => $email,
        ':password' => $hashedPassword
    ]);

    // Retrieve inserted user
    $stmt = $pdo->prepare("SELECT AsiakasID FROM asiakkaat WHERE Email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["error" => "Failed to retrieve user ID."]);
        exit;
    }

    $pdo->commit();

    $_SESSION['Asiakas_ID'] = $user['AsiakasID'];

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Account created successfully!",
        "redirect" => "../index.php"
    ]);
} catch (PDOException $e) {
    $pdo->rollBack();

    // Duplicate email
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(["error" => "Email already registered."]);
        exit;
    }

    http_response_code(500);
    echo json_encode(["error" => "Database error."]);
    error_log("Database error: " . $e->getMessage());
    exit;
}
