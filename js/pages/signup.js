import { validateSignUpDom } from "../helpers/domValid.js";
import { ErrorMessage } from "../helpers/ErrorMessage.js";
import { isEmailValid, isPasswordStrong, doPasswordsMatch, passwordToggle } from "../helpers/utils.js";
import { getPath } from "../helpers/config.js";
import { signupUser } from "../helpers/api.js";

class SignUpPage {
    // Private fields
    #DOM;
    #error;

    constructor() {
        this.#DOM = validateSignUpDom();
        if (!this.#DOM) throw new Error('Required DOM elements not found');

        this.#error = new ErrorMessage(this.#DOM.errorMessage);

        this.#initializeFormSubmit();

        console.log("SignUpPage instance created and DOM initialized");
    }


    validateForm() {
        const { email, password, confirmPassword } = this.#DOM;
        const emailVal = email.value.trim();
        const passwordVal = password.value;
        const confirmVal = confirmPassword.value;

        if (!isEmailValid(emailVal)) {
            this.#error.show('Syötä kelvollinen sähköposti.');
            email.focus();
            return false;
        }

        if (!isPasswordStrong(passwordVal)) {
            this.#error.show('Salasana ei täytä vaatimuksia...');
            password.focus();
            return false;
        }

        if (!doPasswordsMatch(passwordVal, confirmVal)) {
            this.#error.show('Salasanat eivät täsmää.');
            confirmPassword.focus();
            return false;
        }

        this.#error.hide();
        return true;
    }

    #initializeFormSubmit() {
        const { form, password, passwordToggleBtn, toggleIcon } = this.#DOM;

        form?.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!this.validateForm()) return;
            await this.#submitForm();
        });

        passwordToggleBtn?.addEventListener("click", () => {
            passwordToggle(password, toggleIcon);
        });
    }

    async #submitForm() {
        const { email, password, confirmPassword, submitBtn, csrfToken } = this.#DOM;

        submitBtn.disabled = true;

        const requestData = {
            register: true,
            email: email.value.trim(),
            password: password.value,
            confirm_password: confirmPassword.value,
            csrf_token: csrfToken
        };

        try {
            const result = await signupUser(requestData);

            if (result.success) {
                console.log("Signup success!");
                window.location.href = `${getPath(false)}/pages/kirjaudu.php`;
            } else {
                this.#error.show(result.error || 'Signup failed');
                submitBtn.disabled = false;
            }
        } catch (err) {
            this.#error.show('Signup failed. Please try again.');
            submitBtn.disabled = false;
            console.error(err);
        }
    }
}

const waitForDOM = () =>
    document.readyState === 'loading'
        ? new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))
        : Promise.resolve();

await waitForDOM();

const signUpPage = new SignUpPage();
