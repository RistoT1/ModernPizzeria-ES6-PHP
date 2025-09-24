import { AddToCartButton } from './AddToCartButton.js';

export class Popup {
    constructor({ popupElement, sizeMultipliers }) {
        this.popup = popupElement;
        this.selectedPizzaID = null;
        this.selectedSizeID = "2";
        this.basePrice = 0;
        this.quantityDisplay = this.popup.querySelector('#quantity');
        this.addToCartBtn = null;
        this.sizeMultipliers = sizeMultipliers || {}; // Now this works
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (!this.popup) return;

        this.popup.addEventListener('click', e => {
            if (e.target === this.popup) this.close();
        });

        const closeBtn = this.popup.querySelector('#closePopup');
        if (closeBtn) closeBtn.addEventListener('click', () => this.close());

        const sizeContainer = this.popup.querySelector('.size-options');
        if (sizeContainer) sizeContainer.addEventListener('click', e => this.handleSizeChange(e));

        const qtyContainer = this.popup.querySelector('.quantity-control');
        if (qtyContainer) qtyContainer.addEventListener('click', e => this.handleQuantityChange(e));
    }

    open(pizza) {
        console.log(this.sizeMultipliers)
        this.selectedPizzaID = pizza.PizzaID;
        this.basePrice = parseFloat(pizza.Hinta) || 0;
        this.selectedSizeID = "2";

        const title = this.popup.querySelector('.popup-title');
        const info = this.popup.querySelector('.popup-info');
        const ingredients = this.popup.querySelector('.popup-ingredients');
        const header = this.popup.querySelector('.popup-header');

        if (title) title.textContent = pizza.PizzaNimi || '';
        if (info) info.textContent = pizza.Tiedot || '';
        if (ingredients) {
            ingredients.textContent = Array.isArray(pizza.Ainesosat)
                ? pizza.Ainesosat.join(', ')
                : (pizza.Ainesosat || '');
        }
        if (header) {
            header.style.backgroundImage = `url(${pizza.Kuva ? `src/img/${pizza.Kuva}` : 'src/img/default-pizza.jpg'})`;
        }

        if (this.quantityDisplay) this.quantityDisplay.textContent = '1';

        const sizeBtns = this.popup.querySelectorAll('.size-btn');
        sizeBtns.forEach(btn => btn.classList.remove('active'));
        const defaultSizeBtn = this.popup.querySelector('.size-btn[data-size="2"]');
        if (defaultSizeBtn) defaultSizeBtn.classList.add('active');

        const existingBtn = this.popup.querySelector('.add-to-cart-btn');
        if (existingBtn) existingBtn.remove();

        const buttonContainer = this.popup.querySelector('.popup-info-main') || this.popup.querySelector('.popup-body');
        if (buttonContainer) {
            this.addToCartBtn = new AddToCartButton({
                parentElement: buttonContainer,
                pizzaID: this.selectedPizzaID,
                getSizeID: () => this.selectedSizeID,
                getQuantity: () => parseInt(this.quantityDisplay?.textContent) || 1,
                onSuccess: () => this.close() // Pass close callback
            });
        }

        this.popup.classList.add('active');
        this.updatePrice();
    }

    close() {
        console.log('Closing popup'); // Debug
        this.popup.classList.remove('active');
        if (this.addToCartBtn) {
            const btn = this.popup.querySelector('.add-to-cart-btn');
            if (btn) btn.remove();
            this.addToCartBtn = null;
        }
    }

    updatePrice() {
        const multiplier = this.sizeMultipliers[this.selectedSizeID]?.multiplier || 1;
        const quantity = parseInt(this.quantityDisplay?.textContent) || 1;
        const totalPrice = this.basePrice * quantity * multiplier;

        //:( this.popup.querySelector('.popup-price')?.textContent = `${totalPrice.toFixed(2)} €`; ei toiminu 
        const price = this.popup.querySelector('.popup-price');
        if (price) {
            price.textContent = `${totalPrice.toFixed(2)} €`;
        }
    }

    handleSizeChange(e) {
        const btn = e.target.closest('.size-btn');
        if (!btn) return;

        const sizeBtns = this.popup.querySelectorAll('.size-btn');
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedSizeID = btn.dataset.size;
        this.updatePrice();
    }

    handleQuantityChange(e) {
        const btn = e.target.closest('.qty-btn');
        if (!btn || !this.quantityDisplay) return;

        let current = parseInt(this.quantityDisplay.textContent) || 1;
        const change = parseInt(btn.dataset.change) || 0;
        current = Math.max(1, Math.min(99, current + change));
        this.quantityDisplay.textContent = current;
        this.updatePrice();
    }
}