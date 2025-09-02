<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sakky-Pizzeria</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="css/nav.css">
    <link rel="stylesheet" href="css/popup.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css">
</head>

<body>
    <nav>
        <div class="header-container">
            <div class="Header">
                <div class="title">
                    <h1>Sakky Pizzeria</h1>
                </div>
                <div class="header-links">
                    <a href="#">Home</a>
                    <a href="#">Menu</a>
                    <a href="#">Contact</a>
                    <a href="./pages/kirjaudu.php">Kirjaudu</a>
                    <a href="./pages/ostoskori.php" class="shopping-cart">
                        <i class="fa-solid fa-basket-shopping"></i>
                        <span class="cart-counter">0</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>
    <main>
        <div class="container">
            <div class="hero">
                <h1>Tervetuloa Sakky Pizzeriaan!</h1>
                <h2>Sakky opiskelijoille suunniteltu pizzeria.</h2>
            </div>
            <div class="menu-container">
                <div class="menu" id="menu"></div>
            </div>

        </div>
        <div id="pizzaPopup" class="popup">
            <div class="popup-content">
                <div class="popup-header">
                    <button id="closePopup" class="close-btn">←</button>
                </div>
                <div class="popup-body">
                    <div class="popup-head">
                        <h2 class="popup-title"></h2>
                        <h2 class="popup-price"></h2>
                    </div>
                    <div class="popup-info-main">
                        <p class="popup-info"></p>
                        <p class="popup-ingredients"></p>
                        <div class="size-options">
                            <button class="size-btn" data-size="1">
                                Pieni<br><small>25cm</small>
                            </button>
                            <button class="size-btn active" data-size="2">
                                Normaali<br><small>30cm</small>
                            </button>
                            <button class="size-btn" data-size="3">
                                Suuri<br><small>35cm</small>
                            </button>
                        </div>
                        <div class="quantity-section">
                            <div class="options-title">Määrä</div>
                            <div class="quantity-control">
                                <button class="qty-btn" data-change="-1">-</button>
                                <span class="quantity-display" id="quantity">1</span>
                                <button class="qty-btn" data-change="1">+</button>
                            </div>
                        </div>

                        <button class="add-to-cart-btn" id="addCart">Lisää koriin</button>
                    </div>

                </div>
            </div>
        </div>
    </main>
    <script src="js/index.js"></script>
</body>

</html>