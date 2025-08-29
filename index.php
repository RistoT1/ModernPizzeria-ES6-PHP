<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="css/nav.css">
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
            <div class="popupContent">
                <button id="closePopup">Close</button>
                <h2 class="popupTitle"></h2>
                <p class="popupPrice"></p>
                <p class="popupInfo"></p>
            </div>
        </div>
        </div>
    </main>
    <script src="js/index.js"></script>
</body>

</html>