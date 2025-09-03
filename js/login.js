const form = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');
const password = document.getElementById('password');
const passwordToggle = document.getElementById('passwordToggle');
const toggleIcon = passwordToggle.querySelector('i');

passwordToggle.addEventListener('click', () => {
    password.type = password.type === 'password' ? 'text' : 'password';

    toggleIcon.classList.toggle('fa-eye');
    toggleIcon.classList.toggle('fa-eye-slash');
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!errorMsg) return;
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';

    try {
        const formData = new URLSearchParams(new FormData(form));

        const response = await fetch('../api/loginCheck.php', {
            method: 'POST',
            body: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = data.redirect || 'dashboard.php';
        } else {
            errorMsg.textContent = data.error || 'Login failed.';
            errorMsg.style.display = 'block';
        }
    } catch (err) {
        errorMsg.textContent = 'Network error, please try again.';
        errorMsg.style.display = 'block';
    }
});

