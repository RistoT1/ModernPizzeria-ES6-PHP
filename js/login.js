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

form.addEventListener('submit', async e => {
    e.preventDefault();
    errorMsg.style.display = 'none';

    const payload = {
        login: true,
        email: form.email.value,
        password: form.password.value
    };

    try {
        const res = await fetch('../api/main.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (data.success) {
            window.location.href = data.data.redirect || '../index.php';
        } else {
            errorMsg.textContent = data.error || 'Login failed';
            errorMsg.style.display = 'block';
        }
    } catch (err) {
        errorMsg.textContent = 'Network error: ' + err.message;
        errorMsg.style.display = 'block';
    }
});

