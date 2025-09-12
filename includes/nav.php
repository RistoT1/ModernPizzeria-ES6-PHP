<?php 
include_once 'session.php';
$current_page = basename($_SERVER['PHP_SELF']);
$isLoggedIn = isset($_SESSION['AsiakasID']);
$in_pages_folder = strpos($_SERVER['PHP_SELF'], '/pages/') !== false;
$apiPath = $in_pages_folder ? '../api/main.php' : './api/main.php';
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
                    <button id="logoutBtn" class="logout-btn" style="background:none;border:none;color:inherit;cursor:pointer;">Logout</button>
                <?php else: ?>
                    <a href="<?php echo $in_pages_folder ? '../pages/kirjaudu.php' : './pages/kirjaudu.php'; ?>">Kirjaudu</a>
                <?php endif; ?>

                <a href="<?php echo $in_pages_folder ? '../pages/ostoskori.php' : './pages/ostoskori.php'; ?>" class="shopping-ostoskori">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <span class="cart-counter">0</span>
                </a>
            </div>
        </div>
    </div>
</nav>

<?php if ($isLoggedIn): ?>
<script>
document.getElementById('logoutBtn').addEventListener('click', async () => {
    if (!confirm('Are you sure you want to logout?')) return;

    try {
        const response = await fetch('<?php echo $apiPath; ?>', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({ logout: true })
        });

        const data = await response.json();

        if (data.success) {
            // redirect after successful logout
            window.location.href = '<?php echo $in_pages_folder ? "../index.php" : "./index.php"; ?>';
        } else {
            alert(data.error || 'Logout failed.');
        }
    } catch (err) {
        alert('Network error: ' + err.message);
    }
});
</script>
<?php endif; ?>
