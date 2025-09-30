import { showNotification } from '../../helpers/utils.js';

export class AddressModal {
    constructor({ 
        modalElement,
        openBtn,
        editBtn,
        closeBtn,
        saveBtn,
        addressSection,
        addressDisplayElement,
        streetInput,
        cityInput,
        postalInput,
        onAddressSaved = null
    }) {
        this.modal = modalElement;
        this.openBtn = openBtn;
        this.editBtn = editBtn;
        this.closeBtn = closeBtn;
        this.saveBtn = saveBtn;
        this.addressSection = addressSection;
        this.addressDisplay = addressDisplayElement;
        this.streetInput = streetInput;
        this.cityInput = cityInput;
        this.postalInput = postalInput;
        this.onAddressSaved = onAddressSaved;
        
        this.savedAddress = this.loadAddress();
        
        if (!this.modal) {
            console.error('AddressModal: Modal element not provided');
            return;
        }

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.displaySavedAddress();
    }

    loadAddress() {
        try {
            const saved = sessionStorage.getItem('savedAddress');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading address:', error);
            return null;
        }
    }

    setupEventListeners() {
        // Open modal buttons
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => this.open());
        }

        if (this.editBtn) {
            this.editBtn.addEventListener('click', () => this.open());
        }

        // Close modal button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Save address button
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.save());
        }

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });

        // Input validation
        this.setupInputValidation();
    }

    setupInputValidation() {
        const inputs = [this.streetInput, this.cityInput, this.postalInput];

        inputs.forEach(input => {
            if (!input) return;

            input.addEventListener('blur', () => {
                this.validateInput(input);
            });

            input.addEventListener('focus', () => {
                input.style.borderColor = '';
            });
        });

        // Postal code specific validation
        if (this.postalInput) {
            this.postalInput.addEventListener('input', () => {
                // Allow only numbers and spaces
                this.postalInput.value = this.postalInput.value.replace(/[^\d\s]/g, '');
            });
        }
    }

    validateInput(input) {
        if (!input) return false;
        
        const value = input.value.trim();
        const isValid = value.length > 0;

        input.style.borderColor = isValid ? '#28a745' : '#dc3545';
        return isValid;
    }

    validateAllInputs() {
        const street = this.validateInput(this.streetInput);
        const city = this.validateInput(this.cityInput);
        const postal = this.validateInput(this.postalInput);

        return street && city && postal;
    }

    open() {
        if (!this.modal) return;

        // Load saved address into inputs if exists
        if (this.savedAddress) {
            if (this.streetInput) this.streetInput.value = this.savedAddress.street || '';
            if (this.cityInput) this.cityInput.value = this.savedAddress.city || '';
            if (this.postalInput) this.postalInput.value = this.savedAddress.postal || '';
        } else {
            // Clear inputs if no saved address
            if (this.streetInput) this.streetInput.value = '';
            if (this.cityInput) this.cityInput.value = '';
            if (this.postalInput) this.postalInput.value = '';
        }

        this.modal.style.display = 'block';
        
        // Focus first input
        if (this.streetInput) {
            setTimeout(() => this.streetInput.focus(), 100);
        }
    }

    close() {
        if (!this.modal) return;
        this.modal.style.display = 'none';
        
        // Reset border colors
        [this.streetInput, this.cityInput, this.postalInput].forEach(input => {
            if (input) input.style.borderColor = '';
        });
    }

    isOpen() {
        return this.modal && this.modal.style.display === 'block';
    }

    save() {
        // Validate all inputs
        if (!this.validateAllInputs()) {
            showNotification('Täytä kaikki osoitekentät', 'error');
            return;
        }

        const street = this.streetInput.value.trim();
        const city = this.cityInput.value.trim();
        const postal = this.postalInput.value.trim();

        // Additional validation
        if (postal.length < 5) {
            showNotification('Tarkista postinumero', 'error');
            this.postalInput.focus();
            return;
        }

        // Save address
        this.savedAddress = { street, city, postal };
        sessionStorage.setItem('savedAddress', JSON.stringify(this.savedAddress));

        // Update display
        this.displaySavedAddress();

        // Call callback if provided
        if (this.onAddressSaved) {
            this.onAddressSaved(this.savedAddress);
        }

        showNotification('Osoite tallennettu', 'success');
        this.close();
    }

    displaySavedAddress() {
        if (!this.savedAddress) return;

        // Update address display
        if (this.addressDisplay) {
            this.addressDisplay.innerHTML = `
                <div class="saved-address">
                    <strong>${this.savedAddress.street}</strong><br>
                    ${this.savedAddress.postal} ${this.savedAddress.city}
                </div>
            `;
        }

        // Show/hide appropriate elements
        if (this.openBtn) this.openBtn.style.display = 'none';
        if (this.addressSection) this.addressSection.style.display = 'block';
    }

    getAddress() {
        return this.savedAddress;
    }

    clearAddress() {
        this.savedAddress = null;
        sessionStorage.removeItem('savedAddress');
        
        if (this.addressDisplay) {
            this.addressDisplay.innerHTML = '';
        }

        if (this.openBtn) this.openBtn.style.display = 'block';
        if (this.addressSection) this.addressSection.style.display = 'none';
    }
}