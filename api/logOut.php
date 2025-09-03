<?php
// logOut.php
session_start();

// Check if the user is actually logged in
if (!isset($_SESSION['AsiakasID'])) {
    // Optionally, redirect to login page or return a message
    header('Location: ../pages/kirjaudu.php');
    exit();
}

// Unset all session variables
$_SESSION = [];

// Destroy the session
if (session_id() != "" || isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}
session_destroy();

// Optionally, redirect to home page after logout
header('Location: ../index.php');
exit();
