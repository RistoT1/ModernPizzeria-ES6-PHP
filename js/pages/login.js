import { ErrorMessage } from "../helpers/ErrorMessage.js";
import { validateLoginDom } from "../helpers/domValid.js";
import { passwordToggle } from "../helpers/utils.js";
import { getPath } from "../helpers/config.js";
import { loginUser } from "../helpers/api.js";

class LoginPage {
    #DOM;
    #error;

    constructor() {
        this.#DOM = validateLoginDom();
        if (!this.#DOM) throw new Error('Required DOM elements not found');

        this.#error = new ErrorMessage(this.#DOM.errorMessage);

        this.#initializeFormSubmit();
        console.log('loaded');
    }

    #initializeFormSubmit() {
        const { form, password, passwordToggleBtn, toggleIcon } = this.#DOM;

        form?.addEventListener("submit", async (e) => {
            await this.#submitForm(e);
        });

        passwordToggleBtn?.addEventListener("click", () => {
            passwordToggle(password, toggleIcon);
        });
    };

    async #submitForm(e) {
        e.preventDefault();
        const { email, password, submitBtn, csrfToken } = this.#DOM;

        submitBtn.disabled = true;

        const requestData = {
            login: true,
            email: email.value.trim(),
            password: password.value,
            csrf_token: csrfToken
        };

        try {
            const result = await loginUser(requestData);
            console.log('Login result:', result);
            if (result.success) {
                console.log("Login success!");
                window.location.href = `${getPath(false)}/index.php`;
            } else {
                console.log("Login failed!");
                this.#error.show(result.error || 'Signup failed');
                submitBtn.disabled = false;
            }
        } catch (err) {
            this.#error.show('Login failed. Please try again.');
            submitBtn.disabled = false;
            console.error(err);
        }

    };
}

const waitForDOM = () =>
    document.readyState === 'loading'
        ? new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))
        : Promise.resolve();

await waitForDOM();

const loginPage = new LoginPage();