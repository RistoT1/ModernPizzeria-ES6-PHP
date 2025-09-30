import { showNotification } from '../../helpers/utils.js';
import { fetchCartQuantity } from '../../helpers/api.js';

export class CheckoutForm {
    constructor({ formElement, isLoggedIn = false, onSubmitSuccess = null }) {
        this.form = formElement;
        this.isLoggedIn = isLoggedIn;
        this.onSubmitSuccess = onSubmitSuccess;
        this.savedAddress = this.loadSavedAddress();
        
        if (!this.form) {
            console.error('CheckoutForm: Form element not provided');
            return;
        }

        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupSubmitHandler();
    }

    loadSavedAddress() {
        try {
            const saved = sessionStorage.getItem('savedAddress');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading saved address:', error);
            return null;
        }
    }

    setupFormValidation() {
        if (this.isLoggedIn) return; // Skip validation for logged-in users

        const requiredInputs = this.form.querySelectorAll('input[required]');
        
        requiredInputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });

            // Reset border on focus
            input.addEventListener('focus', () => {
                input.style.borderColor = '';
            });

            // Real-time validation for specific fields
            if (input.type === 'email') {
                input.addEventListener('input', () => {
                    if (input.value.length > 0) {
                        this.validateEmail(input);
                    }
                });
            }

            if (input.type === 'tel') {
                input.addEventListener('input', () => {
                    if (input.value.length > 0) {
                        this.validatePhone(input);
                    }
                });
            }
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        const isValid = value.length > 0;

        input.style.borderColor = isValid ? '#28a745' : '#dc3545';
        return isValid;
    }

    validateEmail(input) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailPattern.test(input.value.trim());
        
        input.style.borderColor = isValid ? '#28a745' : '#dc3545';
        return isValid;
    }

    validatePhone(input) {
        const phonePattern = /^[\d\s\-\+\(\)]+$/;
        const value = input.value.trim();
        const isValid = phonePattern.test(value) && value.length >= 6;
        
        input.style.borderColor = isValid ? '#28a745' : '#dc3545';
        return isValid;
    }

    validateAllFields() {
        if (this.isLoggedIn) return true;

        const requiredInputs = this.form.querySelectorAll('input[required]');
        let allValid = true;

        requiredInputs.forEach(input => {
            if (!this.validateInput(input)) {
                allValid = false;
            }
        });

        return allValid;
    }

    collectFormData() {
        if (this.isLoggedIn) {
            return { loggedIn: true };
        }

        const formData = {
            Enimi: this.getFieldValue('Enimi'),
            Snimi: this.getFieldValue('Snimi'),
            Email: this.getFieldValue('email'),
            Puh: this.getFieldValue('puhelin'),
            Osoite: this.savedAddress?.street || '',
            PostiNum: this.savedAddress?.postal || '',
            PostiTp: this.savedAddress?.city || '',
            loggedIn: false
        };

        return formData;
    }

    getFieldValue(fieldId) {
        const field = document.getElementById(fieldId);
        return field ? field.value.trim() : '';
    }

    async validateCheckout() {
        // Validate form fields
        if (!this.validateAllFields()) {
            showNotification('Täytä kaikki pakolliset kentät', 'error');
            return false;
        }

        // Check if address is provided for guest checkout
        if (!this.isLoggedIn && !this.savedAddress) {
            showNotification('Lisää toimitusosoite', 'error');
            return false;
        }

        // Check if cart has items
        const { items: cartItems } = await fetchCartQuantity({ includeItems: true });
        if (!cartItems || cartItems.length === 0) {
            showNotification('Ostoskori on tyhjä', 'error');
            return false;
        }

        return true;
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate everything
        const isValid = await this.validateCheckout();
        if (!isValid) return;

        try {
            // Collect customer data
            const customerData = this.collectFormData();

            // Fetch cart items
            const { items: cartItems } = await fetchCartQuantity({ includeItems: true });

            // Store in sessionStorage
            sessionStorage.setItem('customerData', JSON.stringify(customerData));
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

            // Call success callback or redirect
            if (this.onSubmitSuccess) {
                this.onSubmitSuccess(customerData, cartItems);
            }

        } catch (error) {
            console.error('Error submitting checkout:', error);
            showNotification('Virhe käsiteltäessä tilausta', 'error');
        }
    }

    setupSubmitHandler() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    updateAddress(address) {
        this.savedAddress = address;
        sessionStorage.setItem('savedAddress', JSON.stringify(address));
    }
}