<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Sakky Pizzeria - Savon Ammatti- ja Aikuisopiston opiskelijoiden ylläpitämä pizzeria Kuopiossa">
    <title>Sakky Pizzeria - Savon Ammatti- ja Aikuisopisto</title>
    <link rel="stylesheet" href="css/reset.css"
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/nav.css">
    <style>
      

        :root {
            --primary-black: #000;
            --primary-white: #fff;
            --gray-dark: #1a1a1a;
            --gray-medium: #333;
            --gray-light: #666;
            --gray-lighter: #999;
            --transition: cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            background: var(--primary-black);
            color: var(--primary-white);
            overflow-x: hidden;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .order-btn {
            padding: 0.8rem 2rem;
            background: var(--primary-white);
            color: var(--primary-black);
            border: 1px solid var(--primary-white);
            cursor: pointer;
            font-family: inherit;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            transition: all 0.3s ease;
        }

        .order-btn:hover,
        .order-btn:focus {
            background: var(--primary-black);
            color: var(--primary-white);
            outline: none;
        }

        /* Hero Section */
        .hero {
            height: 100vh;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .hero-image-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--gray-dark);
        }

        .hero-image-placeholder {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .hero-image-placeholder::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background: 
                linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%),
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px);
            animation: pulse 4s ease-in-out infinite;
        }

        .placeholder-content {
            text-align: center;
            z-index: 1;
            border: 2px solid rgba(255, 255, 255, 0.1);
            padding: 4rem 6rem;
            background: rgba(0, 0, 0, 0.3);
        }

        .placeholder-icon {
            font-size: 5rem;
            margin-bottom: 1.5rem;
            opacity: 0.3;
            animation: float 3s ease-in-out infinite;
        }

        .placeholder-text {
            font-size: 0.9rem;
            color: var(--gray-lighter);
            letter-spacing: 3px;
            font-weight: 300;
            text-transform: uppercase;
        }

        .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%);
        }

        .hero-content {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 0 2rem;
        }

        .hero-badge {
            display: inline-block;
            padding: 0.5rem 2rem;
            border: 1px solid rgba(255, 255, 255, 0.3);
            font-size: 0.75rem;
            letter-spacing: 3px;
            margin-bottom: 2.5rem;
            text-transform: uppercase;
            font-weight: 300;
        }

        .hero-content h1 {
            font-size: clamp(3rem, 8vw, 5.5rem);
            font-weight: 300;
            letter-spacing: clamp(6px, 2vw, 12px);
            margin-bottom: 1.5rem;
            text-transform: uppercase;
        }

        .hero-content p {
            font-size: clamp(1rem, 2vw, 1.1rem);
            letter-spacing: 4px;
            font-weight: 300;
            margin-bottom: 3rem;
            color: var(--gray-lighter);
            text-transform: uppercase;
        }

        .hero-buttons {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .hero-cta {
            padding: 1.2rem 3rem;
            cursor: pointer;
            font-family: inherit;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            transition: all 0.3s var(--transition);
            border: 1px solid;
        }

        .hero-cta.primary {
            background: var(--primary-white);
            color: var(--primary-black);
            border-color: var(--primary-white);
        }

        .hero-cta.primary:hover,
        .hero-cta.primary:focus {
            background: transparent;
            color: var(--primary-white);
            transform: translateY(-3px);
            outline: none;
        }

        .hero-cta.secondary {
            background: transparent;
            color: var(--primary-white);
            border-color: var(--primary-white);
        }

        .hero-cta.secondary:hover,
        .hero-cta.secondary:focus {
            background: var(--primary-white);
            color: var(--primary-black);
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
        }

        .scroll-indicator:hover {
            opacity: 1;
        }

        .scroll-indicator::after {
            content: '↓';
            font-size: 2rem;
            color: var(--primary-white);
        }

        /* About Section */
        .about {
            padding: 10rem 5%;
            background: var(--primary-white);
            color: var(--primary-black);
        }

        .about-container {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8rem;
            align-items: center;
        }

        .about-image {
            background: var(--gray-dark);
            height: 600px;
            position: relative;
            overflow: hidden;
            border: 1px solid #e0e0e0;
        }

        .about-image::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            height: 300px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: rotate 30s linear infinite;
        }

        .about-image::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: rotate 20s linear infinite reverse;
        }

        .section-badge {
            display: inline-block;
            padding: 0.4rem 1.5rem;
            border: 1px solid var(--gray-light);
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 3px;
            margin-bottom: 2rem;
            text-transform: uppercase;
        }

        .about-content h2 {
            font-size: clamp(2.5rem, 5vw, 3.5rem);
            margin-bottom: 2.5rem;
            letter-spacing: 2px;
            font-weight: 300;
            line-height: 1.2;
            text-transform: uppercase;
        }

        .about-content p {
            font-size: 1.05rem;
            line-height: 2;
            margin-bottom: 1.5rem;
            color: var(--gray-light);
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

        .stat-number {
            font-size: clamp(2.5rem, 5vw, 3.5rem);
            font-weight: 300;
            margin-bottom: 0.5rem;
            color: var(--primary-black);
            letter-spacing: 2px;
        }

        .stat-label {
            font-size: 0.8rem;
            letter-spacing: 3px;
            font-weight: 500;
            color: var(--gray-light);
            text-transform: uppercase;
        }

        /* Menu Section */
        .menu {
            padding: 10rem 5%;
            background: var(--primary-black);
        }

        .menu-container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .menu-header {
            text-align: center;
            margin-bottom: 6rem;
        }

        .menu h2 {
            font-size: clamp(2.5rem, 5vw, 3.5rem);
            margin-bottom: 1.5rem;
            letter-spacing: 4px;
            font-weight: 300;
            text-transform: uppercase;
        }

        .menu-subtitle {
            font-size: 1rem;
            color: var(--gray-lighter);
            letter-spacing: 3px;
            font-weight: 300;
            text-transform: uppercase;
        }

        .menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 4rem;
        }

        .menu-item {
            position: relative;
            cursor: pointer;
            transition: transform 0.3s var(--transition), opacity 0.3s ease;
        }

        .menu-item:hover {
            transform: translateY(-10px);
        }

        .menu-item-image {
            width: 100%;
            aspect-ratio: 1;
            background: var(--gray-dark);
            position: relative;
            overflow: hidden;
            transition: border-color 0.3s ease;
            border: 1px solid var(--gray-medium);
        }

        .menu-item:hover .menu-item-image {
            border-color: var(--primary-white);
        }

        .menu-item-image::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60%;
            height: 60%;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
        }

        .menu-item-image::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40%;
            height: 40%;
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 50%;
        }

        .menu-item-content {
            text-align: center;
            margin-top: 2rem;
        }

        .menu-item-content h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            letter-spacing: 3px;
            font-weight: 400;
            text-transform: uppercase;
        }

        .menu-item-content p {
            color: var(--gray-lighter);
            font-size: 0.95rem;
            letter-spacing: 1px;
            line-height: 1.8;
            font-weight: 300;
        }

        .menu-item-price {
            margin-top: 1.5rem;
            font-size: 1.3rem;
            font-weight: 300;
            color: var(--primary-white);
            letter-spacing: 2px;
        }

        /* Location Section */
        .location {
            padding: 10rem 5%;
            background: var(--gray-dark);
        }

        .location-container {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8rem;
            align-items: center;
        }

        .location-info h2 {
            font-size: clamp(2.5rem, 5vw, 3.5rem);
            margin-bottom: 3rem;
            letter-spacing: 4px;
            font-weight: 300;
            text-transform: uppercase;
        }

        .location-details {
            margin-bottom: 4rem;
        }

        .location-detail-item {
            display: flex;
            align-items: flex-start;
            gap: 2rem;
            margin-bottom: 2rem;
            padding: 1.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            transition: padding-left 0.3s ease;
        }

        .location-detail-item:hover {
            padding-left: 1rem;
        }

        .location-icon {
            font-size: 1.2rem;
            opacity: 0.5;
            min-width: 24px;
        }

        .location-detail-item p {
            font-size: 1rem;
            color: var(--gray-lighter);
            letter-spacing: 1px;
            line-height: 1.8;
            font-weight: 300;
        }

        .hours {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 3rem;
        }

        .hours h3 {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            letter-spacing: 3px;
            font-weight: 400;
            text-transform: uppercase;
        }

        .hours p {
            color: var(--gray-lighter);
            margin-bottom: 1rem;
            font-size: 1rem;
            font-weight: 300;
            letter-spacing: 1px;
        }

        .location-map {
            height: 600px;
            background: var(--gray-medium);
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .location-map::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 80%;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .location-map::after {
            content: '📍';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            opacity: 0.3;
            animation: bounce 2s ease-in-out infinite;
        }

        /* Footer */
        footer {
            padding: 6rem 5% 3rem;
            background: var(--primary-black);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-content {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 6rem;
            margin-bottom: 4rem;
        }

        .footer-about h3 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            font-weight: 400;
            letter-spacing: 3px;
            text-transform: uppercase;
        }

        .footer-about p {
            color: var(--gray-lighter);
            line-height: 2;
            margin-bottom: 2rem;
            font-weight: 300;
            font-size: 0.95rem;
        }

        .social-links {
            display: flex;
            gap: 1rem;
        }

        .social-links a {
            width: 45px;
            height: 45px;
            background: transparent;
            color: var(--primary-white);
            border: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.8rem;
            transition: all 0.3s ease;
        }

        .social-links a:hover,
        .social-links a:focus {
            background: var(--primary-white);
            color: var(--primary-black);
            border-color: var(--primary-white);
            outline: none;
        }

        .footer-links h4 {
            font-size: 1rem;
            margin-bottom: 2rem;
            font-weight: 500;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .footer-links ul {
            list-style: none;
        }

        .footer-links ul li {
            margin-bottom: 1rem;
        }

        .footer-links ul li a {
            color: var(--gray-lighter);
            text-decoration: none;
            transition: color 0.3s ease;
            font-size: 0.9rem;
            font-weight: 300;
            letter-spacing: 1px;
        }

        .footer-links ul li a:hover,
        .footer-links ul li a:focus {
            color: var(--primary-white);
        }

        .newsletter h4 {
            font-size: 1rem;
            margin-bottom: 2rem;
            font-weight: 500;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .newsletter-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .newsletter input {
            padding: 1rem 1.5rem;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: var(--primary-white);
            font-family: inherit;
            font-size: 0.9rem;
            transition: border-color 0.3s ease;
        }

        .newsletter input:focus {
            outline: none;
            border-color: var(--primary-white);
        }

        .newsletter input::placeholder {
            color: var(--gray-lighter);
        }

        .newsletter button {
            padding: 1rem 1.5rem;
            background: var(--primary-white);
            color: var(--primary-black);
            border: 1px solid var(--primary-white);
            cursor: pointer;
            font-family: inherit;
            font-weight: 600;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: all 0.3s ease;
        }

        .newsletter button:hover,
        .newsletter button:focus {
            background: transparent;
            color: var(--primary-white);
            outline: none;
        }

        .footer-bottom {
            max-width: 1400px;
            margin: 0 auto;
            padding-top: 3rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
            color: var(--gray-lighter);
            font-size: 0.85rem;
            font-weight: 300;
            letter-spacing: 1px;
        }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes bounce {
            0%, 100% { transform: translate(-50%, -50%) translateY(0); }
            50% { transform: translate(-50%, -50%) translateY(-15px); }
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes rotate {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .fade-in {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s var(--transition), transform 0.8s var(--transition);
        }

        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .about-container,
            .location-container {
                grid-template-columns: 1fr;
                gap: 5rem;
            }
            
            .footer-content {
                grid-template-columns: 1fr;
                gap: 3rem;
            }
            
            .stats {
                gap: 2rem;
            }
        }

        @media (max-width: 768px) {

            
            .menu-grid {
                grid-template-columns: 1fr;
                gap: 3rem;
            }
            
            .hero-buttons {
                flex-direction: column;
                width: 100%;
                max-width: 400px;
                margin: 0 auto;
            }
            
            .hero-cta {
                width: 100%;
            }
            
            .stats {
                grid-template-columns: 1fr;
            }
            
            .about-image,
            .location-map {
                height: 400px;
            }
            
            .placeholder-content {
                padding: 3rem 2rem;
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
        <section class="hero" id="home" aria-labelledby="hero-heading">
            <div class="hero-image-container">
                <div class="hero-image-placeholder">
                    <div class="placeholder-content">
                        <div class="placeholder-icon" aria-hidden="true">□</div>
                        <div class="placeholder-text">Image Placeholder</div>
                    </div>
                </div>
            </div>
            <div class="hero-overlay" aria-hidden="true"></div>
            <div class="hero-content">
                <div class="hero-badge">Savon Ammatti- ja Aikuisopisto</div>
                <h1 id="hero-heading">SAKKY</h1>
                <p>Pizzeria</p>
                <div class="hero-buttons">
                    <button class="hero-cta primary" data-scroll-to="menu">Menu</button>
                    <button class="hero-cta secondary" data-scroll-to="about">Lisätietoja</button>
                </div>
            </div>
            <button class="scroll-indicator" aria-label="Vieritä alas" data-scroll-to="about"></button>
        </section>

        <section class="about fade-in" id="about" aria-labelledby="about-heading">
            <div class="about-container">
                <div class="about-image" role="img" aria-label="Decorative image placeholder"></div>
                <div class="about-content">
                    <span class="section-badge">Meistä</span>
                    <h2 id="about-heading">Ammattitaitoa<br>Intohimoa</h2>
                    <p>Sakky Pizzeria on osa Savon ammatti- ja aikuisopiston koulutusohjelmaa, jossa opiskelijat kehittävät taitojaan aidossa ravintolaympäristössä.</p>
                    <p>Jokainen pizza valmistetaan huolella, yhdistäen perinteisiä italialaisia menetelmiä nykyaikaiseen laatustandardiin.</p>
                    <p>Tuemme nuorten ammattilaisten kasvua ja tarjoamme samalla laadukasta ruokaa yhteisöllemme.</p>
                    <div class="stats" role="list" aria-label="Tilastot">
                        <div class="stat" role="listitem">
                            <div class="stat-number" data-target="3" aria-label="3 vuotta">0</div>
                            <div class="stat-label">Vuotta</div>
                        </div>
                        <div class="stat" role="listitem">
                            <div class="stat-number" data-target="10000" aria-label="10000 pizzaa">0</div>
                            <div class="stat-label">Pizzaa</div>
                        </div>
                        <div class="stat" role="listitem">
                            <div class="stat-number" data-target="50" aria-label="50 opiskelijaa">0</div>
                            <div class="stat-label">Opiskelijaa</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="menu fade-in" id="menu" aria-labelledby="menu-heading">
            <div class="menu-container">
                <div class="menu-header">
                    <h2 id="menu-heading">Valikoimamme</h2>
                    <p class="menu-subtitle">Tuoreita aineksia • Perinteisiä reseptejä</p>
                </div>
                <div class="menu-grid" role="list" aria-label="Pizzavalikoimamme">
                    <article class="menu-item" role="listitem">
                        <div class="menu-item-image" role="img" aria-label="Margherita pizza"></div>
                        <div class="menu-item-content">
                            <h3>Margherita</h3>
                            <p>Tomaatti, mozzarella, tuore basilika, oliiviöljy</p>
                            <div class="menu-item-price">9,50 €</div>
                        </div>
                    </article>
                    <article class="menu-item" role="listitem">
                        <div class="menu-item-image" role="img" aria-label="Pepperoni pizza"></div>
                        <div class="menu-item-content">
                            <h3>Pepperoni</h3>
                            <p>Tomaatti, mozzarella, pepperoni, oregano</p>
                            <div class="menu-item-price">10,90 €</div>
                        </div>
                    </article>
                    <article class="menu-item" role="listitem">
                        <div class="menu-item-image" role="img" aria-label="Vegetariana pizza"></div>
                        <div class="menu-item-content">
                            <h3>Vegetariana</h3>
                            <p>Tomaatti, mozzarella, kausikasvikset, yrtit</p>
                            <div class="menu-item-price">10,50 €</div>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section class="location fade-in" id="location" aria-labelledby="location-heading">
            <div class="location-container">
                <div class="location-info">
                    <h2 id="location-heading">Yhteystiedot</h2>
                    <div class="location-details">
                        <div class="location-detail-item">
                            <span class="location-icon" aria-hidden="true">•</span>
                            <p>Savon Ammatti- ja Aikuisopisto<br>Kuopio, Suomi</p>
                        </div>
                        <div class="location-detail-item">
                            <span class="location-icon" aria-hidden="true">•</span>
                            <p><a href="tel:+358441234567" style="color: inherit; text-decoration: none;">044 123 4567</a></p>
                        </div>
                        <div class="location-detail-item">
                            <span class="location-icon" aria-hidden="true">•</span>
                            <p><a href="mailto:sakky@pizzeria.fi" style="color: inherit; text-decoration: none;">sakky@pizzeria.fi</a></p>
                        </div>
                    </div>
                    <div class="hours">
                        <h3>Aukioloajat</h3>
                        <p>Maanantai – Torstai: 11:00 – 18:00</p>
                        <p>Perjantai: 11:00 – 19:00</p>
                        <p>Viikonloppu: Suljettu</p>
                    </div>
                </div>
                <div class="location-map" role="img" aria-label="Kartan paikkamerkki"></div>
            </div>
        </section>
    </main>

    <!-- <footer role="contentinfo">
        <div class="footer-content">
            <div class="footer-about">
                <h3>Sakky Pizzeria</h3>
                <p>Savon ammatti- ja aikuisopiston opiskelijoiden ylläpitämä pizzeria. Kehitämme ammattitaitoa ja palvelemme yhteisöämme.</p>
                <div class="social-links" role="list" aria-label="Sosiaalisen median linkit">
                    <a href="#" aria-label="Facebook" role="listitem">FB</a>
                    <a href="#" aria-label="Instagram" role="listitem">IG</a>
                    <a href="#" aria-label="LinkedIn" role="listitem">IN</a>
                </div>
            </div>
            <nav class="footer-links" aria-label="Footer navigation">
                <h4>Linkit</h4>
                <ul>
                    <li><a href="#home">Etusivu</a></li>
                    <li><a href="#about">Meistä</a></li>
                    <li><a href="#menu">Menu</a></li>
                    <li><a href="#location">Yhteystiedot</a></li>
                </ul>
            </nav>
            <div class="newsletter">
                <h4>Uutiskirje</h4>
                <form class="newsletter-form" aria-label="Uutiskirjeen tilauslomake">
                    <label for="newsletter-email" class="visually-hidden">Sähköpostiosoite</label>
                    <input type="email" id="newsletter-email" placeholder="Sähköpostiosoite" required>
                    <button type="submit">Tilaa</button>
                </form>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 Sakky Pizzeria — Savon Ammatti- ja Aikuisopisto</p>
        </div>
    </footer> -->

    <script>
        'use strict';
        
        // Performance optimization: passive event listeners
        const passiveSupported = (() => {
            let supported = false;
            try {
                const opts = Object.defineProperty({}, 'passive', {
                    get() { supported = true; }
                });
                window.addEventListener('test', null, opts);
                window.removeEventListener('test', null, opts);
            } catch (e) {}
            return supported;
        })();

        const eventOptions = passiveSupported ? { passive: true } : false;

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeInObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => fadeInObserver.observe(el));

        // Smooth scrolling with error handling
        const smoothScroll = (targetId) => {
            const target = document.querySelector(targetId);
            if (!target) return;
            
            target.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        };

        // Event delegation for scroll buttons
        document.addEventListener('click', (e) => {
            const scrollTarget = e.target.closest('[data-scroll-to]');
            if (scrollTarget) {
                e.preventDefault();
                const targetId = `#${scrollTarget.dataset.scrollTo}`;
                smoothScroll(targetId);
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId && targetId !== '#') {
                    e.preventDefault();
                    smoothScroll(targetId);
                }
            });
        });

        // Animated counter with RAF
        const animateCounter = (element, target, suffix = '') => {
            const duration = 2000;
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
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
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.dataset.target, 10);
                        const suffix = target >= 1000 ? '+' : '';
                        animateCounter(stat, target, suffix);
                    });
                    
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const aboutSection = document.querySelector('.about');
        if (aboutSection) statsObserver.observe(aboutSection);

        // Newsletter form with validation
        const newsletterForm = document.querySelector('.newsletter-form');
        
        newsletterForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = e.target.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert(`Kiitos! Vahvistusviesti lähetetty osoitteeseen: ${email}`);
                e.target.reset();
            } else {
                alert('Syötä kelvollinen sähköpostiosoite.');
            }
        });

        // Menu item interactions with improved performance
        const menuGrid = document.querySelector('.menu-grid');
        
        if (menuGrid) {
            menuGrid.addEventListener('mouseenter', (e) => {
                const item = e.target.closest('.menu-item');
                if (item) {
                    const items = menuGrid.querySelectorAll('.menu-item');
                    items.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.style.opacity = '0.4';
                        }
                    });
                }
            }, true);

            menuGrid.addEventListener('mouseleave', () => {
                const items = menuGrid.querySelectorAll('.menu-item');
                items.forEach(item => {
                    item.style.opacity = '1';
                });
            });
        }

        // Parallax effect with throttling
        const heroImagePlaceholder = document.querySelector('.hero-image-placeholder');
        let parallaxTicking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            if (heroImagePlaceholder && scrolled < window.innerHeight) {
                const parallaxSpeed = 0.3;
                heroImagePlaceholder.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
            parallaxTicking = false;
        };

        const handleParallax = () => {
            if (!parallaxTicking) {
                window.requestAnimationFrame(updateParallax);
                parallaxTicking = true;
            }
        };

        window.addEventListener('scroll', handleParallax, eventOptions);


        // Prevent layout shift on load
        const initPage = () => {
            document.body.style.opacity = '1';
            
            // Preload critical content
            const criticalImages = document.querySelectorAll('[data-src]');
            criticalImages.forEach(img => {
                img.src = img.dataset.src;
            });
        };

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPage);
        } else {
            initPage();
        }

        // Error handling for async operations
        window.addEventListener('error', (e) => {
            console.error('Page error:', e.error);
        });

        // Performance monitoring (optional)
        if ('PerformanceObserver' in window) {
            try {
                const perfObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            console.warn('Long task detected:', entry.duration);
                        }
                    }
                });
                perfObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // PerformanceObserver not fully supported
            }
        }
    </script>
</body>
</html>