<?php 
session_start(); 
if (empty($_SESSION['csrf_token'])) {     
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32)); 
} 
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Kirjaudu -Sakky Pizzeria</title>
    <link rel="stylesheet" href="../css/reset.css" />
    <link rel="stylesheet" href="../css/main.css" />
    <link rel="stylesheet" href="../css/kirjaudu.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body data-page="login">
    <div class="login-container">
        <div class="login-header">
            <h1 class="login-title">Tervetuloa</h1>
            <p class="login-subtitle">Kirjaudu sisään!</p>
        </div>

        <div class="login-form">
            <div id="errorMsg" class="login-message error" style="display:none;"></div>

            <form id="loginForm" class="login-form" action="../api/loginCheck.php" method="post" autocomplete="off">
                <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>" />
                
                <div class="login-form-group">
                    <label for="email" class="login-form-label">Sähköposti</label>
                    <div class="login-input-wrapper">
                        <input 
                            id="email"
                            class="login-form-input with-icon" 
                            type="email" 
                            name="email" 
                            required 
                            placeholder="Syötä Sähköposti"
                            autocomplete="email"
                        />
                    </div>
                </div>

                <div class="login-form-group">
                    <label for="password" class="login-form-label">Salasana</label>
                    <div class="login-input-wrapper">
                        <input 
                            id="password"
                            class="login-form-input with-icon" 
                            type="password" 
                            name="password" 
                            required 
                            placeholder="Syötä salasana"
                            autocomplete="current-password"
                        />
                        <button type="button" class="password-toggle" id="passwordToggle">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </div>
                <button type="submit" class="login-btn" id="loginBtn">
                    Sign In
                </button>
            </form>
        </div>

        <div class="signup-link-wrapper">
            <h1 class="signup-link-text">Ei käyttäjää? <img src="../src/img/meme.png" alt=""></h1>
            <a href="rekisteroidy.php" class="signup-link">Luo käyttäjä</a>
        </div>
    </div>

    <script type="module" src="../js/login.js"></script>
</body>
</html>