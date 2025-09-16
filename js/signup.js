const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const showError = (element, message) => {
    element.textContent = message;
    element.style.display = 'block';
};

const hideError = (element) => {
    element.textContent = '';
    element.style.display = 'none';
};

const isEmailValid = (email) => email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPasswordStrong = (password) => passwordRegex.test(password); // Fixed this line
const doPasswordsMatch = (password, confirmPassword) => password === confirmPassword;

const validateForm = (emailInput, passwordInput, confirmInput, errorElement) => {
    const emailVal = emailInput.value.trim();
    const passwordVal = passwordInput.value;
    const confirmVal = confirmInput.value;

    if (!isEmailValid(emailVal)) {
        showError(errorElement, 'Syötä kelvollinen sähköposti.');
        return false;
    }

    if (!isPasswordStrong(passwordVal)) {
        showError(errorElement, 'Salasana ei täytä vaatimuksia (vähintään 8 merkkiä, isoja ja pieniä kirjaimia, numero ja erikoismerkki).');
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
    
    // Create proper JSON payload for POST request
    const requestData = {
        register: true, // This tells the PHP router which function to call
        email: emailInput.value.trim(),
        password: passwordInput.value,
        confirm_password: confirmInput.value,
        csrf_token: csrfToken
    };

    // Disable button during submission
    submitBtn.disabled = true;

    try {
        const response = await fetch('../api/main.php', { // Removed ?register from URL
            method: 'POST',
            body: JSON.stringify(requestData), // Send as JSON
            headers: {
                'Content-Type': 'application/json', // Changed content type
                'X-CSRF-Token': csrfToken
            }
        });

        const data = await response.json();
        console.log(data)
        if (data.success === true) {
            window.location.href = data.data?.redirect;
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
// Main code
// =======================
const handleSignup = () => {
    const form = document.getElementById('signupForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const errorMessage = document.getElementById('error');
    const submitBtn = document.getElementById('submitBtn');
    const passwordToggle = document.getElementById('passwordToggle');
    
    // Check if elements exist before adding event listeners
    if (!form || !email || !password || !confirmPassword || !errorMessage || !submitBtn) {
        console.error('Required form elements not found');
        return;
    }

    // Password toggle functionality (optional)
    if (passwordToggle) {
        const toggleIcon = passwordToggle.querySelector('i');
        passwordToggle.addEventListener('click', () => {
            password.type = password.type === 'password' ? 'text' : 'password';
            
            if (toggleIcon) {
                toggleIcon.classList.toggle('fa-eye');
                toggleIcon.classList.toggle('fa-eye-slash');
            }
        });
    }

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