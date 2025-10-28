<?php
function handleRegister($pdo, $input)
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Read and sanitize input
    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';
    $confirmPassword = $input['confirm_password'] ?? '';
    $csrfToken = $input['csrf_token'] ?? null;  // Must be defined for CSRF check

    // CSRF check


    // Validate required fields
    if (!$email || !$password || !$confirmPassword) {
        throw new Exception("Missing form data.", 400);
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format.", 400);
    }

    // Check password confirmation
    if ($password !== $confirmPassword) {
        throw new Exception("Passwords do not match.", 400);
    }

    // Password strength validation
    if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,128}$/", $password)) {
        throw new Exception("Password does not meet strength requirements (8-128 characters, upper/lowercase, number, special char).", 400);
    }

    // Check if email already exists
    try {
        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM asiakkaat WHERE Email = :email");
        $checkStmt->execute([':email' => $email]);
        if ($checkStmt->fetchColumn() > 0) {
            throw new Exception("Email already registered.", 409);
        }
    } catch (PDOException $e) {
        throw new Exception("Database error.", 500);
    }

    // Hash the password et tiennytkään tätä :-D
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert user into database
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
        if ($e->getCode() == 23000) { // Duplicate email (backup)
            throw new Exception("Email already registered.", 409);
        }
        throw new Exception("Database error.", 500);
    }
}
?>
