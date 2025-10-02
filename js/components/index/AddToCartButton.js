import { checkQuantityLimit, showNotification, updateCartCounter } from '../../helpers/utils.js';
import { fetchCartQuantity, addItemToCart } from '../../helpers/api.js';
import { CartBackup } from './cartBackup.js';

export class AddToCartButton {
    constructor({ parentElement, pizzaID, getSizeID = () => "2", getQuantity = () => 1, onSuccess = null }) {
        this.parentElement = parentElement;
        this.pizzaID = pizzaID;
        this.getSizeID = getSizeID;
        this.getQuantity = getQuantity;
        this.onSuccess = onSuccess;

        this.button = null;
    }

    renderButton() {
        if (!this.parentElement) {
            console.warn('AddToCartButton parentElement is missing');
            return;
        }
        if (this.parentElement.querySelector('.add-to-cart-btn')) return;
        this.button = document.createElement('button');
        this.button.className = 'add-to-cart-btn';
        this.button.textContent = 'Lisää koriin';
        this.parentElement.appendChild(this.button);

        this.button.addEventListener('click', () => this.addToCart());
    }

    setLoadingState(isLoading) {
        if (!this.button) return;
        this.button.disabled = isLoading;
        this.button.textContent = isLoading ? 'Lisätään...' : 'Lisää koriin';
    }

    async addToCart() {
        if (!this.button) return;
        this.setLoadingState(true);

        try {
            if (await checkQuantityLimit(this.getQuantity, fetchCartQuantity, showNotification, this.setLoadingState.bind(this))) {
                return;
            }

            const itemPayload = {
                pizzaID: this.pizzaID,
                sizeID: this.getSizeID(),
                quantity: this.getQuantity()
            };
            
            const success = await addItemToCart(itemPayload);

            if (success) {
                showNotification('Lisätty koriin!', 'success');
                updateCartCounter(await fetchCartQuantity());
                this.onSuccess?.();
            } else {
                showNotification('Virhe lisättäessä koriin', 'error');
            }

        } catch (error) {
            console.error('Add to cart error:', error);
            showNotification('Istunto menetetty. Uusi vieraskortti luotu.', 'error');

            const token = CartBackup.loadGuestToken() || `guest_${Date.now()}`;
            CartBackup.saveGuestToken(token);

            updateCartCounter(await fetchCartQuantity());

        } finally {
            this.setLoadingState(false);
        }
    }
}
