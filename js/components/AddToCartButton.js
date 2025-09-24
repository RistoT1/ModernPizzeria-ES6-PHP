import { showNotification, updateCartCounter } from '../utils.js';
import { fetchCartQuantity } from '../api.js';
import { CartBackup } from './cartBackup.js';

export class AddToCartButton {
    constructor({ parentElement, pizzaID, getSizeID = () => "2", getQuantity = () => 1, pizzaData = null, onSuccess = null }) {
        this.parentElement = parentElement;
        this.pizzaID = pizzaID;
        this.getSizeID = getSizeID;
        this.getQuantity = getQuantity;
        this.pizzaData = pizzaData; // Full pizza object (needed for local storage)
        this.onSuccess = onSuccess;

        this.button = document.createElement('button');
        this.button.className = 'add-to-cart-btn';
        this.button.textContent = 'Lisää koriin';
        this.parentElement.appendChild(this.button);

        this.button.addEventListener('click', () => this.addToCart());
    }

    async addToCart() {
        console.log('AddToCart clicked'); // Debug

        const payload = {
            addItem: true,
            pizzaID: this.pizzaID,
            quantity: this.getQuantity(),
            size: this.getSizeID()
        };

        console.log('Payload:', payload); // Debug

        this.button.disabled = true;
        this.button.textContent = 'Lisätään...';

        try {
            const res = await fetch('./api/main.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log('Response status:', res.status); // Debug
            const result = await res.json();
            console.log('API Response:', result); // Debug

            // Save to local storage regardless of API success
            if (this.pizzaData) {
                const pizzaToSave = {
                    ...this.pizzaData,       // all pizza properties
                    quantity: this.getQuantity(),
                    size: this.getSizeID()
                };
                CartBackup.addItem(pizzaToSave);
            }

            if (result.success) {
                console.log('Success! Showing notification'); // Debug
                showNotification('Lisätty koriin!', 'success');

                const qty = await fetchCartQuantity(); // This will now also update localStorage
                updateCartCounter(qty);

                if (this.onSuccess) this.onSuccess();
            } else {
                console.log('API returned error:', result.message); // Debug
                showNotification(result.message || 'Virhe lisättäessä koriin', 'error');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            showNotification('Verkkovirhe. Koriin lisätty paikallisesti.', 'error');

            // Ensure item is saved to local storage even if API fails
            if (this.pizzaData) {
                const pizzaToSave = {
                    ...this.pizzaData,
                    quantity: this.getQuantity(),
                    size: this.getSizeID()
                };
                CartBackup.addItem(pizzaToSave);

                const qty = CartBackup.load().totalQuantity;
                updateCartCounter(qty);
            }
        } finally {
            this.button.disabled = false;
            this.button.textContent = 'Lisää koriin';
        }
    }
}
