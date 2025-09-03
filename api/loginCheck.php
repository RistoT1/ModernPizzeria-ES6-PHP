<?php
session_start();
header('Content-Type: application/json');

//salli vain post
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Post only!"]);
    exit;
}

//csrf validointi
if (
    !isset($_POST['csrf_token'], $_SESSION['csrf_token']) ||
    !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])
) {
    http_response_code(403);
    echo json_encode(["error" => "Invalid CSRF token"]);
    exit;
}

// input validointi
if (!isset($_POST["email"], $_POST["password"])) {
    http_response_code(400);
    echo json_encode(["error" => "Email or password not set."]);
    exit;
}

$email = trim($_POST["email"]);
$password = $_POST["password"];

try {
    require_once "../src/config.php";

    // hakee käyttäjän sähköpostilla
    //NOT NULL ei ota vieras rivejä
    $stmt = $pdo->prepare("SELECT AsiakasID, PasswordHash FROM asiakkaat WHERE Email = ? AND PasswordHash IS NOT NULL LIMIT 1");
    $stmt->execute([$email]);
    $kayttaja = $stmt->fetch(PDO::FETCH_ASSOC);

    //käyttäjää ei löydy
    if (!$kayttaja) {
        http_response_code(404);
        echo json_encode(["error" => "User doesn't exist."]);
        exit;
    }

    // salasana varmistus
    if (!password_verify($password, $kayttaja['PasswordHash'])) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid password."]);
        exit;
    }

    // salasana oikein -> vaihtaa session id (estää session manipuloinnin)
    session_regenerate_id(true);
    //asettaa asiakas id
    $asiakasID = $kayttaja['AsiakasID'];
    $_SESSION['AsiakasID'] = $asiakasID;

    //käsittelee vieras korin
    if (isset($_SESSION['guestToken'])) {
        $guestToken = $_SESSION['guestToken'];

        //saa vieraan ostoskorin
        $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE GuestToken = :guestToken ORDER BY UpdatedAt DESC LIMIT 1");
        $stmt->execute(['guestToken' => $guestToken]);
        $guestCart = $stmt->fetch(PDO::FETCH_ASSOC);

        //jos saa vieras korin
        if ($guestCart) {
            $guestCartID = $guestCart['OstoskoriID'];

            //katsoo korin tuotteiden määrän
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM ostoskori_rivit WHERE OstoskoriID = :guestCartID");
            $stmt->execute(['guestCartID' => $guestCartID]);
            $guestCartCount = (int) $stmt->fetchColumn();

            //jos määrä on suurempi kuin 0 eli onko tuotteita
            if ($guestCartCount > 0) {
                //hakee käyttäjän ostoskorin
                $stmt = $pdo->prepare("SELECT OstoskoriID FROM ostoskori WHERE AsiakasID = :asiakasID ORDER BY UpdatedAt DESC LIMIT 1");
                $stmt->execute(['asiakasID' => $asiakasID]);
                $userCart = $stmt->fetch(PDO::FETCH_ASSOC);

                //jos käyttäjällä on ostoskori
                if ($userCart) {
                    //ostokorin id määritys
                    $userCartID = $userCart['OstoskoriID'];

                    // poista käyttäjän vanhat ostokset
                    $stmt = $pdo->prepare("DELETE FROM ostoskori_rivit WHERE OstoskoriID = :userCartID");
                    $stmt->execute(['userCartID' => $userCartID]);

                    //poistaa käyttäjän ostoskorin
                    $stmt = $pdo->prepare("DELETE FROM ostoskori WHERE OstoskoriID = :userCartID");
                    $stmt->execute(['userCartID' => $userCartID]);
                }

                // vieraskori = uusi asiakkaan kori
                $stmt = $pdo->prepare("
                    UPDATE ostoskori 
                    SET AsiakasID = :asiakasID, GuestToken = NULL, UpdatedAt = NOW() 
                    WHERE OstoskoriID = :guestCartID
                ");
                $stmt->execute([
                    'asiakasID' => $asiakasID,
                    'guestCartID' => $guestCartID
                ]);
                //kori id on vieraskori --> uusi asiakaskori ID
                $_SESSION['cartID'] = $guestCartID;
            } else {
                //jos vieras kori on tyhjä siirtyy asiakas koriin ja poistaa vieraskorin.
                $stmt = $pdo->prepare("DELETE FROM ostoskori WHERE OstoskoriID = :guestCartID");
                $stmt->execute(['guestCartID' => $guestCartID]);
            }
        }

        //poistaa vierastokenin
        unset($_SESSION['guestToken']);
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Login successful.",
        "redirect" => "../index.php"
    ]);
    exit;

} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "An error occurred, please try again later."]);
    exit;
}
