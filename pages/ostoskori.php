<?php
include_once '../includes/session.php';
$isLoggedIn = isset($_SESSION['AsiakasID']);
?>
<!DOCTYPE html>
<html lang="fi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ostoskori - Sakky Pizzeria</title>
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/ostoskori.css">
    <link rel="stylesheet" href="../css/notification.css">
    <link rel="stylesheet" href="../css/nav.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css">

</head>

<body>
    <?php include_once('../includes/nav.php'); ?>
    <main>
        <div class="container">
            <!-- Header -->
            <div class="cart-header">
                <h1>Ostoskori</h1>
                <p>Tarkista tilauksesi ja siirry kassalle</p>
            </div>

            <!-- Cart Items -->
            <div class="cart-container">
                <div class="cart-items" id="cartItems">

                </div>

                <div class="cart-empty" id="cartEmpty">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <h3>Ostoskorisi on tyhjä</h3>
                    <p>Lisää pizzoja koriin aloittaaksesi tilauksen</p>
                    <a href="../index.php" class="btn-primary">Takaisin menuun</a>
                </div>

                <!-- Customer Info Form -->

                <div class="customer-info" id="customerInfo">

                    <form action="" class="info-form" id="info-form-guest" <?php if ($isLoggedIn) {
                        echo 'style="display:none;"';
                    } ?>>
                        <label for="Enimi">Etunimi</label>
                        <input type="text" name="Enimi" id="Enimi" required>

                        <label for="Snimi">Sukunimi</label>
                        <input type="text" name="Snimi" id="Snimi" required>

                        <label for="email">Sähköpostiosoite</label>
                        <input type="email" name="email" id="email" required>

                        <label for="puhelin">Puhelin</label>
                        <input type="tel" name="puhelin" id="puhelin" required>

                        <div class="address-section" id="addressSection" style="display: none;">
                            <div class="address-field">
                                <span class="address-label">Rappu / asunto</span>
                                <button type="button" class="address-btn" id="editAddressBtn">Muokkaa osoitetta</button>
                            </div>
                            <div class="placeholder-text" id="addressInput"></div>
                        </div>

                        <button type="button" class="address-btn" id="openAddressModalBtn">Syötä osoite</button>
                        <button type="submit" class="submit" id="submit">Maksa</button>
                    </form>

                    <form action="" class="info-form" id="info-form-loggedin" <?php if (!$isLoggedIn) {
                        echo 'style="display:none;"';
                    } ?>>
                        <input type="hidden" id="isLoggedIn" value="<?php echo $isLoggedIn ? '1' : '0'; ?>">
                        <button type="submit" class="submit" id="submit">Maksa</button>
                    </form>
                </div>
            </div>
        </div>

        <!-- Address Modal -->
        <div id="addressModal" class="modal">
            <div class="modal-content">
                <span id="closeModal">&times;</span>
                <h3>Toimitusosoite</h3>

                <label for="street">Katuosoite</label>
                <input type="text" id="street">

                <label for="city">Kaupunki</label>
                <input type="text" id="city">

                <label for="postal">Postinumero</label>
                <input type="text" id="postal">

                <button id="saveAddress">Tallenna osoite</button>
            </div>
        </div>

        <script type="module" src="../js/pages/ostoskori.js"></script>

    </main>
</body>

</html>