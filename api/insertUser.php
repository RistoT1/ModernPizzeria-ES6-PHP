<?php
function handleRegister($pdo, $input) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Read input
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $confirmPassword = $input['confirm_password'] ?? '';
    $csrfToken = $input['csrf_token'] ?? '';

    // CSRF check
    if (!isset($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $csrfToken)) {
        http_response_code(403);
        return ["error" => "Invalid CSRF token."];
    }

    // Validate inputs
    if (!$email || !$password || !$confirmPassword) {
        http_response_code(400);
        return ["error" => "Missing form data."];
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        return ["error" => "Invalid email format."];
    }

    if ($password !== $confirmPassword) {
        http_response_code(400);
        return ["error" => "Passwords do not match."];
    }

    if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/", $password)) {
        http_response_code(400);
        return ["error" => "Password does not meet strength requirements."];
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("INSERT INTO asiakkaat (Email, PasswordHash) VALUES (:email, :password)");
        $stmt->execute([
            ':email' => $email,
            ':password' => $hashedPassword
        ]);

        http_response_code(201);
        return [
            "message" => "Account created successfully!",
            "redirect" => "../index.php"
        ];
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) { // Duplicate email
            http_response_code(409);
            return ["error" => "Email already registered."];
        }
        http_response_code(500);
        error_log("Database error: " . $e->getMessage());
        return ["error" => "Database error."];
    }
}
?>
