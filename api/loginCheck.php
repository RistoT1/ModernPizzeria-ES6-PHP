<?php
function handleLogin($pdo, $input)
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Read input
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';

    if (!$email || !$password) {
        throw new Exception("Email and password are required.", 400);
    }

    // Login logic (same as your previous secure API)
    $stmt = $pdo->prepare("SELECT AsiakasID, PasswordHash FROM asiakkaat WHERE Email = ? AND PasswordHash IS NOT NULL LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        throw new Exception("User not found.", 404);
    }

    if (!password_verify($password, $user['PasswordHash'])) {
          throw new Exception("Invalid password.", 401);
    }

    session_regenerate_id(true);
    $asiakasID = $user['AsiakasID'];
    $_SESSION['AsiakasID'] = $asiakasID;

    //käsittelee vieras korin yhditämisen asiakaskoriin
    if (isset($_SESSION['guestToken'])) {
        cartMerge($pdo, $asiakasID);
    }
    return ["redirect" => "../index.php"];
}

function cartMerge($pdo, $asiakasID)
{
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

    unset($_SESSION['guestToken']);
}
