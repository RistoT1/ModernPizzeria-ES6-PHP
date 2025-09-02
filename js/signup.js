// =======================
// Validointi funktiot
// =======================
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const showError = (element, message) => {
    element.textContent = message;
    element.style.display = 'block';
};

const hideError = (element) => {
    element.textContent = '';
    element.style.display = 'none';
};

const isEmailValid = (email) => email.trim() !== '';
const isPasswordStrong = (password) => passwordRegex.test(password);
const doPasswordsMatch = (password, confirmPassword) => password === confirmPassword;

const validateForm = (emailInput, passwordInput, confirmInput, errorElement) => {
    const emailVal = emailInput.value.trim();
    const passwordVal = passwordInput.value;
    const confirmVal = confirmInput.value;

    if (!isEmailValid(emailVal)) {
        showError(errorElement, 'Syötä sähköposti.');
        return false;
    }

    if (!isPasswordStrong(passwordVal)) {
        showError(errorElement, 'Salasana ei täytä vaatimuksia.');
        return false;
    }

    if (!doPasswordsMatch(passwordVal, confirmVal)) {
        showError(errorElement, 'Salasanat eivät täsmää.');
        return false;
    }

    hideError(errorElement);
    return true;
};

// =======================
// Form submit
// =======================
const submitForm = async (form, emailInput, passwordInput, confirmInput, errorElement, submitBtn) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const formData = new URLSearchParams(new FormData(form));

    // Disable button during submission
    submitBtn.disabled = true;

    try {
        const response = await fetch('../api/insertUser.php', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-Token': csrfToken
            }
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = data.redirect || 'dashboard.php';
        } else {
            showError(errorElement, data.error || 'Tapahtui virhe.');
            submitBtn.disabled = false; // re-enable button for retry
        }
    } catch (err) {
        console.error('Fetch error:', err);
        showError(errorElement, 'Verkkovirhe. Yritä uudelleen.');
        submitBtn.disabled = false; // re-enable button for retry
    }
};

// =======================
// Pääkoodi
// =======================
const handleSignup = () => {
    const form = document.getElementById('signupForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const errorMessage = document.getElementById('error');
    const submitBtn = document.getElementById('submitBtn');
    const passwordToggle = document.getElementById('passwordToggle');

    passwordToggle.addEventListener('click', () => {
        password.type = password.type === 'password' ? 'text' : 'password';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const isValid = validateForm(email, password, confirmPassword, errorMessage);
        if (!isValid) {
            if (!isEmailValid(email.value)) email.focus();
            else if (!isPasswordStrong(password.value)) password.focus();
            else if (!doPasswordsMatch(password.value, confirmPassword.value)) confirmPassword.focus();
            return;
        }

        await submitForm(form, email, password, confirmPassword, errorMessage, submitBtn);
    });
};

document.addEventListener('DOMContentLoaded', handleSignup);
