<?php include_once './includes/session.php'; ?>
<!DOCTYPE html>
<html lang="fi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
        content="Sakky Pizzeria - Savon Ammatti- ja Aikuisopiston opiskelijoiden ylläpitämä pizzeria Kuopiossa">
    <title>Sakky Pizzeria - Savon Ammatti- ja Aikuisopisto</title>
    <link rel="stylesheet" href="css/nav.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css">
    <style>
        :root {
            --color-primary: #000;
            --color-secondary: #fff;
            --color-bg-dark: #1a1a1a;
            --color-bg-medium: #333;
            --color-text-light: #666;
            --color-text-lighter: #999;
            --color-border: rgba(255, 255, 255, 0.1);
            --timing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
            --spacing-base: 1rem;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            background: var(--color-primary);
            color: var(--color-secondary);
            overflow-x: hidden;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Hero Section */
        .hero {
            min-height: 100vh;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 100%);
        }

        .hero__decoration {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-image: url("src/img/Savilahden_kampus_D-585x390.jpg");

            width: clamp(400px, 35vw, 600px);
            height: clamp(400px, 35vw, 600px);




            border: 2px solid var(--color-border);
            pointer-events: none;
            opacity: 0.3;

            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }

        .hero__content {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 0 2rem;
        }

        .hero__badge {
            display: inline-block;
            padding: 0.5rem 2rem;
            border: 1px solid rgba(255, 255, 255, 0.3);
            font-size: 0.75rem;
            letter-spacing: 3px;
            margin-bottom: 2.5rem;
            text-transform: uppercase;
            font-weight: 300;
        }

        .hero__title {
            font-size: clamp(3rem, 8vw, 5.5rem);
            font-weight: 300;
            letter-spacing: clamp(6px, 2vw, 12px);
            margin-bottom: 1.5rem;
            text-transform: uppercase;
        }

        .hero__subtitle {
            font-size: clamp(1rem, 2vw, 1.1rem);
            letter-spacing: 4px;
            font-weight: 300;
            margin-bottom: 3rem;
            color: rgba(248, 214, 61, 1);
            text-transform: uppercase;
        }

        .hero__actions {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            padding: 1.2rem 3rem;
            cursor: pointer;
            font-family: inherit;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            transition: all 0.3s var(--timing-smooth);
            border: 1px solid;
            background: transparent;
            text-decoration: none;
            display: inline-block;
        }

        .btn--primary {
            background: var(--color-secondary);
            color: var(--color-primary);
            border-color: var(--color-secondary);
        }

        .btn--primary:hover,
        .btn--primary:focus {
            background: transparent;
            color: var(--color-secondary);
            transform: translateY(-3px);
            outline: none;
        }

        .btn--secondary {
            background: transparent;
            color: var(--color-secondary);
            border-color: var(--color-secondary);
        }

        .btn--secondary:hover,
        .btn--secondary:focus {
            background: var(--color-secondary);
            color: var(--color-primary);
            transform: translateY(-3px);
            outline: none;
        }

        .scroll-indicator {
            position: absolute;
            bottom: 3rem;
            left: 50%;
            transform: translateX(-50%);
            animation: bounce 2s ease-in-out infinite;
            cursor: pointer;
            opacity: 0.5;
            transition: opacity 0.3s ease;
            background: none;
            border: none;
            color: var(--color-secondary);
            font-size: 2rem;
            padding: 0.5rem;
        }

        .scroll-indicator:hover {
            opacity: 1;
        }

        /* About Section */
        .about {
            padding: 10rem 5%;
            background: var(--color-secondary);
            color: var(--color-primary);
        }

        .about__container {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8rem;
            align-items: center;
        }

        .about__img-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .about__visual-wrapper {
            width: 90%;
            border: 1px solid #e0e0e0;
            overflow: hidden;
            position: relative;
        }

        .about__visual-wrapper img {
            width: 100%;
            height: auto;
            display: block;
        }

        .about__title {
            font-size: clamp(2.5rem, 5vw, 3.5rem);
            margin-bottom: 2.5rem;
            letter-spacing: 2px;
            font-weight: 300;
            line-height: 1.2;
            text-transform: uppercase;
        }

        .about__text {
            font-size: 1.05rem;
            line-height: 2;
            margin-bottom: 1.5rem;
            color: var(--color-text-light);
            font-weight: 300;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 3rem;
            margin-top: 4rem;
            padding-top: 3rem;
            border-top: 1px solid #e0e0e0;
        }

        .stat {
            text-align: center;
        }

        .stat__number {
            font-size: clamp(2.5rem, 5vw, 3.5rem);
            font-weight: 300;
            margin-bottom: 0.5rem;
            color: var(--color-primary);
            letter-spacing: 2px;
            min-height: 1.5em;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .stat__label {
            font-size: 0.8rem;
            letter-spacing: 3px;
            font-weight: 500;
            color: var(--color-text-light);
            text-transform: uppercase;
        }

        /* Menu Section */
        .menu {
            padding: 10rem 5%;
            background: var(--color-primary);
        }

        .menu__container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .menu__header {
            text-align: center;
            margin-bottom: 6rem;
        }

        .menu__title {
            font-size: clamp(2.5rem, 5vw, 3.5rem);
            margin-bottom: 1.5rem;
            letter-spacing: 4px;
            font-weight: 300;
            text-transform: uppercase;
        }

        .menu__subtitle {
            font-size: 1rem;
            color: var(--color-text-lighter);
            letter-spacing: 3px;
            font-weight: 300;
            text-transform: uppercase;
        }

        .menu__grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 4rem;
            margin-bottom: 5rem;
        }

        .menu-item {
            position: relative;
            transition: transform 0.3s var(--timing-smooth);
        }

        .menu-item:hover {
            transform: translateY(-10px);
        }

        .menu-item__visual {
            width: 100%;
            aspect-ratio: 1;
            background: var(--color-bg-dark);
            position: relative;
            overflow: hidden;
            transition: border-color 0.3s ease;
            border: 1px solid var(--color-bg-medium);
        }

        .menu-item__visual img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }

        .menu-item:hover .menu-item__visual {
            transform: translateY(-5px);
            box-shadow: 8px 8px 0 #ce9731;
        }

        .menu-item__content {
            text-align: center;
            margin-top: 2rem;
        }

        .menu-item__title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            letter-spacing: 3px;
            color: orange;
            font-weight: 400;
            text-transform: uppercase;
        }

        .menu-item__description {
            color: var(--color-text-lighter);
            font-size: 0.95rem;
            letter-spacing: 1px;
            line-height: 1.8;
            font-weight: 300;
        }

        .menu__button-container {
            margin: 1.2rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .menu__button {
            padding: 0.6rem 1.2rem;
            background: transparent;
            color: white;
            border: 1px solid white;
            cursor: pointer;
            font-family: inherit;
            font-size: 1.2rem;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            transition: all 0.3s ease;
            white-space: nowrap;
            flex-shrink: 1;
            min-width: 0;
            text-decoration: none;
        }

        .menu__button:hover {
            background: white;
            color: black;
            outline: none;
            transform: translateY(-5px);
        }


        /* Location Section */
        .location {
            padding: 10rem 5%;
            background: var(--color-bg-dark);
        }

        .location__container {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8rem;
            align-items: center;
        }

        .location__title {
            font-size: clamp(2.5rem, 5vw, 3.5rem);
            margin-bottom: 3rem;
            letter-spacing: 4px;
            font-weight: 300;
            text-transform: uppercase;
        }

        .location__details {
            margin-bottom: 4rem;
        }

        .location__item {
            display: flex;
            align-items: flex-start;
            gap: 2rem;
            margin-bottom: 2rem;
            padding: 1.5rem 0;
            border-bottom: 1px solid var(--color-border);
            transition: padding-left 0.3s ease;
        }

        .location__item:hover {
            padding-left: 1rem;
        }

        .location__icon {
            font-size: 1.2rem;
            opacity: 0.5;
            min-width: 24px;
        }

        .location__text {
            font-size: 1rem;
            color: var(--color-text-lighter);
            letter-spacing: 1px;
            line-height: 1.8;
            font-weight: 300;
        }

        .location__text a {
            color: inherit;
            text-decoration: none;
        }

        .hours {
            border-top: 1px solid var(--color-border);
            padding-top: 3rem;
        }

        .hours__title {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            letter-spacing: 3px;
            font-weight: 400;
            text-transform: uppercase;
        }

        .hours__text {
            color: var(--color-text-lighter);
            margin-bottom: 1rem;
            font-size: 1rem;
            font-weight: 300;
            letter-spacing: 1px;
        }

        .location__visual {
            height: 600px;
            width: 600px;
            background: var(--color-bg-medium);
            position: relative;
            overflow: hidden;
            border: 1px solid var(--color-border);
        }

        /* Animations */
        @keyframes pulse {

            0%,
            100% {
                opacity: 1;
            }

            50% {
                opacity: 0.5;
            }
        }

        @keyframes bounce {

            0%,
            100% {
                transform: translate(-50%, -50%) translateY(0);
            }

            50% {
                transform: translate(-50%, -50%) translateY(-15px);
            }
        }

        @keyframes rotate-slow {
            from {
                transform: translate(-50%, -50%) rotate(0deg);
            }

            to {
                transform: translate(-50%, -50%) rotate(360deg);
            }
        }

        .fade-in {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s var(--timing-smooth), transform 0.8s var(--timing-smooth);
        }

        .fade-in.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Responsive */
        @media (max-width: 1024px) {

            .about__container,
            .location__container {
                grid-template-columns: 1fr;
                gap: 5rem;
            }

            .stats {
                gap: 2rem;
            }
        }

        @media (max-width: 768px) {
            .menu__grid {
                grid-template-columns: 1fr;
                gap: 3rem;
            }

            .hero__actions {
                flex-direction: column;
                width: 100%;
                max-width: 400px;
                margin: 0 auto;
            }

            .btn {
                width: 100%;
            }

            .stats {
                grid-template-columns: 1fr;
            }

            .about__visual,
            .location__visual {
                height: 400px;
            }
        }

        @media (prefers-reduced-motion: reduce) {

            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    </style>
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

    <script>
        'use strict';

        // Smooth scroll with error handling
        const smoothScroll = (targetId) => {
            const target = document.getElementById(targetId);
            if (!target) return;

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        };

        // Event delegation for scroll buttons
        document.addEventListener('click', (e) => {
            const scrollBtn = e.target.closest('[data-scroll]');
            if (scrollBtn) {
                e.preventDefault();
                smoothScroll(scrollBtn.dataset.scroll);
            }
        });

        // Intersection Observer for fade-in animations
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        });

        document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

        // Animated counter with fixed width to prevent jitter
        const animateCounter = (element, target) => {
            const duration = 2000;
            const startTime = performance.now();
            const suffix = target >= 1000 ? '+' : '';

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(target * easeOutQuart);

                element.textContent = current.toLocaleString('fi-FI') + suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target.toLocaleString('fi-FI') + suffix;
                }
            };

            requestAnimationFrame(updateCounter);
        };

        // Stats animation
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat__number');

                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.dataset.target, 10);
                        animateCounter(stat, target);
                    });

                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const aboutSection = document.querySelector('.about');
        if (aboutSection) statsObserver.observe(aboutSection);

        // Menu item hover effect
        const menuGrid = document.querySelector('.menu__grid');
        const items = menuGrid.querySelectorAll('.menu-item');

        if (menuGrid) {
            items.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    items.forEach(otherItem => {
                        otherItem.style.opacity = otherItem === item ? '1' : '0.4';
                    });
                });
                item.addEventListener('mouseleave', () => {
                    items.forEach(otherItem => {
                        otherItem.style.opacity = '0.4';
                    });
                });
            });
            menuGrid.addEventListener('mouseleave', () => {
                items.forEach(otherItem => {
                    otherItem.style.opacity = '1';
                });
            });
        }


        // Error handling
        window.addEventListener('error', (e) => {
            console.error('Page error:', e.error);
        });
    </script>
</body>

</html>