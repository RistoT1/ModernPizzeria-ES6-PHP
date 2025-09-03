<?php
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
?>
<!DOCTYPE html>
<html lang="fi">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Rekisteröidy  -Sakky Pizzeria </title>
    <meta name="csrf-token" content="<?php echo $_SESSION['csrf_token']; ?>">
    <link rel="stylesheet" href="../css/reset.css" />
    <link rel="stylesheet" href="../css/main.css" />
    <link rel="stylesheet" href="../css/rekisteroidy.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body data-page="signup">
    <div class="signup-container">
        <div class="signup-header">
            <h1 class="signup-title">Liity Sakky pizzeriaan</h1>
                <p class="signup-subtitle">Luo käyttäjätili päästäksesi alkuun</p>
                <a href="../index.php" class="login-link">Takaisin menuun!</a>
        </div>

        <div class="signup-form">
            <div class="signup-progress">
                <div class="progress-step active">
                    <div class="progress-step-number">1</div>
                    <div class="progress-step-label">Tili</div>
                </div>
                <div class="progress-step">
                    <div class="progress-step-number">2</div>
                    <div class="progress-step-label">Profiili</div>
                </div>
                <div class="progress-step">
                    <div class="progress-step-number">3</div>
                    <div class="progress-step-label">Valmis</div>
                </div>
            </div>

            <form id="signupForm" class="signup-form" novalidate>
                <input type="hidden" name="csrf_token"
                    value="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>" />

                <div class="signup-form-section">
                    <div class="signup-form-section-title">
                        Tili
                    </div>

                    <div class="signup-form-group">
                        <label for="email" class="signup-form-label required">Sähköposti</label>
                        <div class="signup-input-wrapper">
                            <input id="email" class="signup-form-input" type="email" name="email" required
                                autocomplete="email" placeholder="Syötä sähköpostiosoitteesi" />
                        </div>
                    </div>

                    <div class="signup-form-group">
                        <label for="password" class="signup-form-label required">Salasana</label>
                        <div class="signup-input-wrapper">
                            <input id="password" class="signup-form-input" type="password" name="password" required
                                autocomplete="new-password" placeholder="Luo vahva salasana" />
                            <button type="button" class="password-toggle" id="passwordToggle">
                                <i class="fa-solid fa-eye-slash"></i>
                            </button>
                        </div>
                        <div class="password-strength">
                            <div class="password-strength-bar">
                                <div class="password-strength-fill" id="passwordStrengthFill"></div>
                            </div>
                            <div class="password-strength-text" id="passwordStrengthText">Salasanan vahvuus</div>
                        </div>
                        <div id="passwordInfo" class="field-warning-message" style="display:block;">
                            Vähintään 8 merkkiä, sisältäen isoja ja pieniä kirjaimia, numeron ja erikoismerkin.
                        </div>
                    </div>

                    <div class="signup-form-group">
                        <label for="confirm-password" class="signup-form-label required">Vahvista salasana</label>
                        <div class="signup-input-wrapper">
                            <input id="confirm-password" class="signup-form-input" type="password"
                                name="confirm_password" required autocomplete="new-password"
                                placeholder="Vahvista salasanasi" />
                        </div>
                    </div>
                </div>

                <button type="submit" class="signup-btn" id="submitBtn">
                    Luo tili
                </button>
            </form>
        </div>

        <div id="error" class="signup-message error" style="display:none;"></div>

        <div class="login-link-wrapper">
            <p class="login-link-text">Onko sinulla jo tili?</p>
            <a href="kirjaudu.php" class="login-link">Kirjaudu sisään</a>
        </div>
    </div>

    <script type="module" src="../js/signup.js"></script>
</body>

</html>