<?php include_once 'session.php';
$current_page = basename($_SERVER['PHP_SELF']);
$isLoggedIn = isset($_SESSION['AsiakasID']);

//katsoo onko strpos palautus false vai true ja jos se ei ole false 
//polussa on haluttu osa jolloin arvo on true
$in_pages_folder = strpos($_SERVER['PHP_SELF'], '/pages/') !== false;
?>
<nav class="navbar">
    <div class="navbar-container">
        <div class="navbar-header">
            <div class="navbar-title">
                <h1>Sakky Pizzeria</h1>
            </div>
            <div class="navbar-links">
                <a href="<?php echo $in_pages_folder ? '../index.php' : './index.php'; ?>">Home</a>
                <a href="<?php echo $in_pages_folder ? '../index.php' : './index.php'; ?>">Menu</a>
                <a href="<?php echo $in_pages_folder ? '../contact.php' : './contact.php'; ?>">Contact</a>

                <?php if ($isLoggedIn): ?>
                    <a href="<?php echo $in_pages_folder ? '../api/logOut.php' : './api/logOut.php'; ?>">Logout</a>
                <?php else: ?>
                    <a
                        href="<?php echo $in_pages_folder ? '../pages/kirjaudu.php' : './pages/kirjaudu.php'; ?>">kirjaudu</a>
                <?php endif; ?>

                <a href="<?php echo $in_pages_folder ? '../pages/ostoskori.php' : './pages/ostoskori.php'; ?>"
                    class="shopping-ostoskori">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <span class="cart-counter">0</span>
                </a>
            </div>
        </div>
    </div>
</nav>