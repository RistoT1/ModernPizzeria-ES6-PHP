import { showNotification, updateCartCounter } from '../../helpers/utils.js';
import { fetchCartQuantity, addItemToCart } from '../../helpers/api.js';
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

        this.button.disabled = true;
        this.button.textContent = 'Lisätään...';

        try {
            const pizzaToSave = {
                PizzaID: this.pizzaID,
                KokoID: this.getSizeID(),
                Quantity: this.getQuantity()
            };

            const success = await addItemToCart(pizzaToSave);

            if (success) {
                showNotification('Lisätty koriin!', 'success');
                const qty = await fetchCartQuantity();
                updateCartCounter(qty);
                if (this.onSuccess) this.onSuccess();
            } else {
                showNotification('Virhe lisättäessä koriin', 'error');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            showNotification('Verkkovirhe. Koriin lisätty paikallisesti.', 'error');
            CartBackup.addItem(pizzaToSave);
            const qty = CartBackup.load().totalQuantity;
            updateCartCounter(qty);
        } finally {
            this.button.disabled = false;
            this.button.textContent = 'Lisää koriin';
        }
    }
}
