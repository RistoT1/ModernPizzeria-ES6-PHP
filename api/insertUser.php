<?php
function handleRegister($pdo, $input) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Read input
    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';
    $confirmPassword = $input['confirm_password'] ?? '';
    $csrfToken = $input['csrf_token'] ?? '';

    // CSRF check
    if (!isset($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $csrfToken)) {
        throw new Exception("Invalid CSRF token.", 403);
    }

    // Validate inputs
    if (!$email || !$password || !$confirmPassword) {
        throw new Exception("Missing form data.", 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format.", 400);
    }

    if ($password !== $confirmPassword) {
        throw new Exception("Passwords do not match.", 400);
    }

    if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,128}$/", $password)) {
        throw new Exception("Password does not meet strength requirements lenght 8-128.", 400);
    }

    // Check if email already exists BEFORE hashing password
    try {
        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM asiakkaat WHERE Email = :email");
        $checkStmt->execute([':email' => $email]);
        $emailExists = $checkStmt->fetchColumn() > 0;
        
        if ($emailExists) {
            throw new Exception("Email already registered.", 409);
        }
    } catch (PDOException $e) {
        error_log("Database error checking email: " . $e->getMessage());
        throw new Exception("Database error.", 500);
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("INSERT INTO asiakkaat (Email, PasswordHash) VALUES (:email, :password)");
        $stmt->execute([
            ':email' => $email,
            ':password' => $hashedPassword
        ]);

        return [
            "message" => "Account created successfully!",
            "redirect" => "../index.php"
        ];
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) { // Duplicate email (backup check)
            throw new Exception("Email already registered.", 409);
        }
        error_log("Database error: " . $e->getMessage());
        throw new Exception("Database error.", 500);
    }
}
?>