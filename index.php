<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="css/nav.css">
    <link rel="stylesheet" href="css/popup.css">
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
                    <a href="#">Kirjaudu</a>
                    <a href="#">Ostoskori</a>
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
                        <p class="popup-ingredients">
                        <div class="popup-crust-options">
                            <select name="crust"class="crust" id="crust">
                                <option value="1">normaali</option>
                                <option value="2">pieni</option>
                                <option value="3">suuri</option>
                            </select>

                        </div>

                        <button class="add-to-cart-btn">Lisää koriin</button>
                    </div>

                </div>
            </div>
        </div>
    </main>
    <script src="js/index.js"></script>
</body>

</html>