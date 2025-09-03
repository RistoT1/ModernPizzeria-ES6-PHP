<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Post only!"]);
    exit;
}

if (
    !isset($_POST['csrf_token']) || !isset($_SESSION['csrf_token']) ||
    !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])
) {
    http_response_code(403);
    echo json_encode(["error" => "Invalid CSRF token"]);
    exit;
}

if (!isset($_POST["email"]) || !isset($_POST["password"])) {
    http_response_code(400);
    echo json_encode(["error" => "email or password not set."]);
    exit;
}

$email = trim($_POST["email"]);
$password = $_POST["password"];

try {
    require_once "../src/config.php";

    $stmt = $pdo->prepare("SELECT AsiakasID, PasswordHash FROM asiakkaat WHERE Email = ? AND PasswordHash IS NOT NULL LIMIT 1");
    $stmt->execute([$email]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(404);
        echo json_encode(["error" => "User doesn't exist."]);
        exit;
    }

    if (password_verify($password, $row['PasswordHash'])) {
        session_regenerate_id(true);
        $_SESSION['AsiakasID'] = $row['AsiakasID'];

        if (isset($_SESSION['guestToken'])) {
            $guestToken = $_SESSION['guestToken'];

            $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE GuestToken = :guestToken ORDER BY UpdatedAt DESC LIMIT 1");
            $stmt->execute(['guestToken' => $guestToken]);
            $guestCart = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($guestCart) {
                $guestCartID = $guestCart['OstoskoriID'];

                $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE AsiakasID = :asiakasID ORDER BY UpdatedAt DESC LIMIT 1");
                $stmt->execute(['asiakasID' => $asiakasID]);
                $userCart = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($userCart) {
                    $userCartID = $userCart['OstoskoriID'];
                } else {
                    $stmt = $pdo->prepare("INSERT INTO ostoskori (AsiakasID, CreatedAt, UpdatedAt) VALUES (:asiakasID, NOW(), NOW())");
                    $stmt->execute(['asiakasID' => $asiakasID]);
                    $userCartID = $pdo->lastInsertId();
                }

                $stmt = $pdo->prepare("UPDATE ostoskori_rivit SET OstoskoriID = :userCartID WHERE OstoskoriID = :guestCartID");
                $stmt->execute([
                    'userCartID' => $userCartID,
                    'guestCartID' => $guestCartID
                ]);

                $stmt = $pdo->prepare("DELETE FROM ostoskori WHERE OstoskoriID = :guestCartID");
                $stmt->execute(['guestCartID' => $guestCartID]);
                
                $_SESSION['cartID'] = $userCartID;
            }
        }

        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Login successful.",
            "redirect" => "../index.php"
        ]);
        exit;
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid password."]);
        exit;
    }
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "An error occurred, please try again later."]);
    exit;
}
