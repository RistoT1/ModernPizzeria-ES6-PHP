<?php include_once './includes/session.php'; ?>
<!DOCTYPE html>
<html lang="fi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=0.8">
    <meta name="description"
        content="Sakky Pizzeria - Savon Ammatti- ja Aikuisopiston opiskelijoiden ylläpitämä pizzeria Kuopiossa">
    <title>Sakky Pizzeria - Savon Ammatti- ja Aikuisopisto</title>
    <link rel="stylesheet" href="css/nav.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css">
    <link rel="stylesheet" href="css/index.css">
</head>

<body>
    <?php include_once('includes/nav.php'); ?>
    <main>
        <section class="hero" id="home">
            <div class="hero__decoration" aria-hidden="true"></div>
            <div class="hero__content">
                <div class="hero__badge">Savon Ammatti- ja Aikuisopisto</div>
                <h1 class="hero__title">SAKKY</h1>
                <p class="hero__subtitle">Pizzeria</p>
                <div class="hero__actions">
                    <button class="btn btn--primary" data-scroll="menu">Menu</button>
                    <button class="btn btn--secondary" data-scroll="about">Lisätietoja</button>
                </div>
            </div>
            <button class="scroll-indicator" aria-label="Vieritä alas" data-scroll="about">↓</button>
        </section>

        <section class="about fade-in" id="about">
            <div class="about__container">
                <div class="about__img-container">
                    <div class="about__visual-wrapper" role="img" aria-label="Decorative element">
                        <img src="src/img/index/kokit-2023-_68.jpg-514x390.jpg" alt="savilahden kampus">
                    </div>
                </div>
                <div class="about__content">
                    <h2 class="about__title">Ammattitaitoa<br>Intohimoa</h2>
                    <p class="about__text">Sakky Pizzeria on osa Savon ammatti- ja aikuisopiston koulutusohjelmaa, jossa
                        opiskelijat kehittävät taitojaan aidossa ravintolaympäristössä.</p>
                    <p class="about__text">Jokainen pizza valmistetaan huolella, yhdistäen perinteisiä italialaisia
                        menetelmiä nykyaikaiseen laatustandardiin.</p>
                    <p class="about__text">Tuemme nuorten ammattilaisten kasvua ja tarjoamme samalla laadukasta ruokaa
                        yhteisöllemme.</p>
                    <div class="stats">
                        <div class="stat">
                            <div class="stat__number" data-target="7">0</div>
                            <div class="stat__label">Vuotta</div>
                        </div>
                        <div class="stat">
                            <div class="stat__number" data-target="50">0</div>
                            <div class="stat__label">Pizzaa</div>
                        </div>
                        <div class="stat">
                            <div class="stat__number" data-target="1000">0</div>
                            <div class="stat__label">Opiskelijaa</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="menu fade-in" id="menu">
            <div class="menu__container">
                <div class="menu__header">
                    <h2 class="menu__title">Valikoimamme</h2>
                    <p class="menu__subtitle">Tuoreita aineksia • Perinteisiä reseptejä</p>
                </div>
                <div class="menu__grid">
                    <article class="menu-item">
                        <div class="menu-item__visual" role="img" aria-label="Margherita pizza">
                            <img src="src/img/index/margherita.png" alt="">
                        </div>
                        <div class="menu-item__content">
                            <h3 class="menu-item__title">Margherita</h3>
                            <p class="menu-item__description">Tomaatti, mozzarella, tuore basilika, oliiviöljy</p>
                        </div>
                    </article>
                    <article class="menu-item">
                        <div class="menu-item__visual" role="img" aria-label="Pepperoni pizza">
                            <img src="src/img/index/pepperoni.png" alt="">
                        </div>
                        <div class="menu-item__content">
                            <h3 class="menu-item__title">Pepperoni</h3>
                            <p class="menu-item__description">Tomaatti, mozzarella, pepperoni, oregano</p>
                        </div>
                    </article>
                    <article class="menu-item">
                        <div class="menu-item__visual" role="img" aria-label="Vegetariana pizza">
                            <img src="src/img/index/vegetariana.png" alt="">
                        </div>
                        <div class="menu-item__content">
                            <h3 class="menu-item__title">Vegetariana</h3>
                            <p class="menu-item__description">Tomaatti, mozzarella, kausikasvikset, yrtit</p>
                        </div>
                    </article>
                </div>
                <div class="menu__button-container">
                    <button class="menu__button" id="menu_button">Tutustu menuun</button>
                </div>
            </div>
        </section>

        <section class="location fade-in" id="location">
            <div class="location__container">
                <div class="location__info">
                    <h2 class="location__title">Yhteystiedot</h2>
                    <div class="location__details">
                        <div class="location__item">
                            <span class="location__icon" aria-hidden="true">•</span>
                            <p class="location__text">Savon Ammatti- ja Aikuisopisto<br>Kuopio, Suomi</p>
                        </div>
                        <div class="location__item">
                            <span class="location__icon" aria-hidden="true">•</span>
                            <p class="location__text"><a href="tel:+358441234567">044 123 4567</a></p>
                        </div>
                        <div class="location__item">
                            <span class="location__icon" aria-hidden="true">•</span>
                            <p class="location__text"><a href="mailto:sakky@pizzeria.fi">sakky@pizzeria.fi</a></p>
                        </div>
                    </div>
                    <div class="hours">
                        <h3 class="hours__title">Aukioloajat</h3>
                        <p class="hours__text">Maanantai – Torstai: 11:00 – 18:00</p>
                        <p class="hours__text">Perjantai: 11:00 – 19:00</p>
                        <p class="hours__text">Viikonloppu: Suljettu</p>
                    </div>
                </div>
                <div class="location__visual" role="img" aria-label="Kartan paikkamerkki">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7273.210317989427!2d27.62872283267844!3d62.88772060149665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4684b08e77fbef51%3A0xa858526505e350f0!2sSavon%20ammattiopisto!5e0!3m2!1sfi!2sfi!4v1759753362475!5m2!1sfi!2sfi"
                        width="600" height="600" style="border:0;" allowfullscreen="" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
        </section>
    </main>
    <script type="module" src="js/pages/index.js"></script>
</html>
</body>