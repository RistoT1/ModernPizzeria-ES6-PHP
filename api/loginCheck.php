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
        $asiakasID = $row['AsiakasID'];
        $_SESSION['AsiakasID'] = $asiakasID;

        if (isset($_SESSION['guestToken'])) {
            $guestToken = $_SESSION['guestToken'];

            // Get guest cart
            $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE GuestToken = :guestToken ORDER BY UpdatedAt DESC LIMIT 1");
            $stmt->execute(['guestToken' => $guestToken]);
            $guestCart = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($guestCart) {
                $guestCartID = $guestCart['OstoskoriID'];

                // Check if guest cart has items
                $stmt = $pdo->prepare("SELECT COUNT(*) FROM ostoskori_rivit WHERE OstoskoriID = :guestCartID");
                $stmt->execute(['guestCartID' => $guestCartID]);
                $guestCartCount = (int) $stmt->fetchColumn();

                if ($guestCartCount > 0) {
                    // Get user cart
                    $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE AsiakasID = :asiakasID ORDER BY UpdatedAt DESC LIMIT 1");
                    $stmt->execute(['asiakasID' => $asiakasID]);
                    $userCart = $stmt->fetch(PDO::FETCH_ASSOC);

                    $replaceUserCart = false;

                    if ($userCart) {
                        // Check if user cart has items
                        $stmt = $pdo->prepare("SELECT COUNT(*) FROM ostoskori_rivit WHERE OstoskoriID = :userCartID");
                        $stmt->execute(['userCartID' => $userCart['OstoskoriID']]);
                        $userCartCount = (int) $stmt->fetchColumn();

                        // Only replace user cart if it has items
                        if ($userCartCount > 0) {
                            $replaceUserCart = true;
                        }
                    }

                    if ($replaceUserCart) {
                        // Delete old user cart
                        $stmt = $pdo->prepare("DELETE FROM ostoskori_rivit WHERE OstoskoriID = :userCartID");
                        $stmt->execute(['userCartID' => $userCart['OstoskoriID']]);

                        $stmt = $pdo->prepare("DELETE FROM ostoskori WHERE OstoskoriID = :userCartID");
                        $stmt->execute(['userCartID' => $userCart['OstoskoriID']]);
                    }

                    // Assign guest cart to user (regardless if we replaced or not)
                    $stmt = $pdo->prepare("UPDATE ostoskori SET AsiakasID = :asiakasID, GuestToken = NULL, UpdatedAt = NOW() WHERE OstoskoriID = :guestCartID");
                    $stmt->execute([
                        'asiakasID' => $asiakasID,
                        'guestCartID' => $guestCartID
                    ]);

                    $_SESSION['cartID'] = $guestCartID;
                }

                // Remove guest token from session
                unset($_SESSION['guestToken']);
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
