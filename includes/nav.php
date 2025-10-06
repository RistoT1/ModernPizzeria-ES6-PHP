<?php
$current_page = basename($_SERVER['PHP_SELF']);
$isLoggedIn = isset($_SESSION['AsiakasID']);
$in_pages_folder = strpos($_SERVER['PHP_SELF'], '/pages/') !== false;
$apiPath = $in_pages_folder ? '../api/main.php' : './api/main.php';
$jsPath = $in_pages_folder ? '../js/includes/nav.js' : './js/includes/nav.js';
$isIndexPage = ($current_page === 'index.php');
?>
<nav id="navbar" role="navigation" aria-label="Main navigation">
    <div class="nav-left">
        <div class="logo">SAKKY</div>
    </div>
    <div class="nav-center">
        <ul class="nav-links">
            <?php
                // Data-driven nav items to avoid hardcoding in multiple places
                $navItems = [
                    [
                        'href' => $in_pages_folder ? '../index.php#home' : '#home',
                        'label' => 'Etusivu'
                    ],
                    [
                        'href' => $in_pages_folder ? '../index.php#about' : '#about',
                        'label' => 'Meistä'
                    ],
                    [
                        'href' => $in_pages_folder ? 'menu.php#menu' : './pages/menu.php#menu',
                        'label' => 'Menu'
                    ],
                    [
                        'href' => $in_pages_folder ? '../index.php#location' : './index.php#location',
                        'label' => 'Yhteystiedot'
                    ],
                    [
                        'href' => $in_pages_folder ? '../pages/ostoskori.php' : './pages/ostoskori.php',
                        'label' => '<i class="fa-solid fa-basket-shopping"></i><span class="cart-counter">0</span>',
                        'extra' => 'class="shopping-ostoskori" aria-label="Ostoskori"'
                    ]
                ];

                foreach ($navItems as $item) {
                    $href = $item['href'];
                    $label = $item['label'];
                    $extra = isset($item['extra']) ? $item['extra'] : '';
                    // Output anchor; active class will be set client-side for hashes and by pathname matching
                    echo "<li><a href=\"$href\" $extra>$label</a></li>";
                }
            ?>
        </ul>
    </div>
    <div class="nav-right">
        <div class="nav-actions">
            <?php if ($isIndexPage): ?>
                <button class="order-btn" aria-label="Siirry menuun">Tilaa</button>
            <?php endif; ?>

            <?php if ($isLoggedIn): ?>
                <button id="logoutBtn" class="logout-btn">Kirjaudu ulos</button>
            <?php else: ?>
                <a href="<?php echo $in_pages_folder ? '../pages/kirjaudu.php' : './pages/kirjaudu.php'; ?>"
                    class="login-link">Kirjaudu</a>
            <?php endif; ?>
        </div>
    </div>

    <!-- Mobile toggle button placeholder -->
    <button class="mobile-menu-toggle" aria-label="Toggle menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
    </button>
</nav>
<div class="notification-container"></div>

<script type="module" src="<?php echo $jsPath; ?>"></script>