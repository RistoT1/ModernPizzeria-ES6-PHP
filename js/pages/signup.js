import { ErrorMessage } from "../components/Signup/ErrorMessage.js";
import { signupUser } from "../helpers/api.js";
import { getPath } from "../helpers/config.js";
import { validateSignUpDom } from "../helpers/domValid.js";
import { isEmailValid, isPasswordStrong, doPasswordsMatch } from "../helpers/utils.js";

class SignpPage {
    constructor() {
        this.DOM = null;
        this.error = null;
    }
    
    async init() {
        this.DOM = validateSignUpDom();
        if (!this.DOM) {
            throw new Error('Required DOM elements not found');
        }
        this.error = new ErrorMessage(this.DOM.errorMessage);
        this.initializeFormSubmit(); // ← THIS WAS MISSING!
        console.log("loaded");
    }

    validateForm() {
        const { email, password, confirmPassword } = this.DOM;

        const emailVal = email.value.trim();
        const passwordVal = password.value;
        const confirmVal = confirmPassword.value;

        if (!isEmailValid(emailVal)) {
            this.error.show('Syötä kelvollinen sähköposti.');
            this.DOM.email.focus();
            return false;
        }
        if (!isPasswordStrong(passwordVal)) {
            this.error.show('Salasana ei täytä vaatimuksia...');
            this.DOM.password.focus();
            return false;
        }
        if (!doPasswordsMatch(passwordVal, confirmVal)) {
            this.error.show('Salasanat eivät täsmää.');
            this.DOM.confirmPassword.focus();
            return false;
        }

        this.error.hide();
        return true;
    }

    initializeFormSubmit() {
        const { form, passwordToggle} = this.DOM;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!this.validateForm()) {
                return;
            }
            await this.submitForm();
        });
        passwordToggle.addEventListener('click',() =>{
            const toggleIcon = passwordToggle.querySelector('i');
            password.type = password.type === 'password' ? 'text' : 'password';
            if (toggleIcon) {
                toggleIcon.classList.toggle('fa-eye');
                toggleIcon.classList.toggle('fa-eye-slash');
            }
        })
    }
    
    async submitForm() {
        const { email, password, confirmPassword, submitBtn } = this.DOM;
        submitBtn.disabled = true;
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        const requestData = {
            register: true,
            email: email.value.trim(),
            password: password.value,
            confirm_password: confirmPassword.value,
            csrf_token: csrfToken
        };

        const result = await signupUser(requestData);
        if (result.success) {
            console.log("signup success!");
            window.location.href = `${getPath(false)}/pages/kirjaudu.php`;
        } else {
            this.error.show(result.error || 'Signup failed');
            submitBtn.disabled = false;
        }
    }
}

const waitForDOM = () => {
    return new Promise(resolve => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
};

// Start the application
waitForDOM().then(() => {
    const signpPage = new SignpPage();
    signpPage.init();
});