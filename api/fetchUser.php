<?php
function fetchUser($pdo)
{
    $asiakasID = $_SESSION['AsiakasID'] ?? null;
    if (!$asiakasID) {
        if (!isset($_SESSION['guestToken'])) {
            $_SESSION['guestToken'] = bin2hex(random_bytes(16));
        }
        throw new Exception("Kayttaja ei ole kirjautunut", 401);
    }

    return getInfo($pdo, $asiakasID);
}

function getInfo($pdo ,$asiakasID)
{
    $stmt = $pdo->prepare("SELECT AsiakasID, Enimi, Snimi, Puh, Email, Osoite,PostiNum,PostiTp FROM asiakkaat WHERE AsiakasID = :asiakasID AND PasswordHash IS NOT NULL LIMIT 1");
    $stmt->execute(['asiakasID' => $asiakasID]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        throw new Exception("Käyttäjää ei löydy.", 404);
    }
    return $user;
}
?>