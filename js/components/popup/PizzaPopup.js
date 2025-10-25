import { Popup } from './Popup.js';
import { AddToCartButton } from '../menu/AddToCartButton.js';

export class PizzaPopup extends Popup {
    constructor({ sizeMultipliers, extras } = {}) {
        super(); // Call parent constructor
        
        // Pizza-specific properties
        this.sizeMultipliers = sizeMultipliers || {};
        this.extras = extras || {};
        this.selectedPizzaID = null;
        this.selectedSizeID = "2";
        this.basePrice = 0;
        this.addToCartBtn = null;
        
        // Pizza-specific DOM elements
        this.sizeContainer = null;
        this.qtyContainer = null;
        this.quantityDisplay = null;
        this.popupPrice = null;
        this.popupInfo = null;
        this.popupIngredients = null;
    }

    /*needed elements */
    cacheDOM() {
        super.cacheDOM(); 
        
        // Cache pizza-specific elements
        const { sizeContainer, qtyContainer, quantityDisplay, 
                popupPrice, popupInfo, popupIngredients } = this.DOM;
        
        Object.assign(this, {
            sizeContainer, qtyContainer, quantityDisplay,
            popupPrice, popupInfo, popupIngredients
        });
    }

    /** ---------- Override bindEvents to add pizza-specific handlers ---------- */
    bindEvents() {
        super.bindEvents(); // Call parent to bind common events
        
        // Add pizza-specific event listeners
        this.sizeContainer?.addEventListener('click', e => this.handleSizeChange(e));
        this.qtyContainer?.addEventListener('click', e => this.handleQuantityChange(e));
    }

    /*Override open with pizza data*/
    open(pizza) {
        if (!pizza) return;

        // Set pizza state
        this.selectedPizzaID = pizza.PizzaID || pizza.id;
        this.basePrice = parseFloat(pizza.Hinta) || 0;
        this.selectedSizeID = "2";

        this.resetQuantity();
        this.populatePopup(pizza);
        this.renderAddToCartButton();
        this.updatePrice();

        super.open(pizza); // Call parent open to show popup
    }

    /*specific Methods*/
    resetQuantity() {
        if (this.quantityDisplay) this.quantityDisplay.textContent = '1';
    }

    populatePopup(pizza) {
        this.setTitle(pizza.PizzaNimi || '');
        
        if (this.popupInfo) this.popupInfo.textContent = pizza.Tiedot || '';
        
        if (this.popupIngredients) {
            this.popupIngredients.textContent = Array.isArray(pizza.Ainesosat)
                ? pizza.Ainesosat.join(', ')
                : pizza.Ainesosat || '';
        }
        
        const imagePath = pizza.Kuva 
            ? `../src/img/${pizza.Kuva}` 
            : '../src/img/default-pizza.jpg';
        this.setHeaderImage(imagePath);

        this.setActiveSize('2');
    }

    setActiveSize(sizeID) {
        const sizeBtns = this.sizeContainer?.querySelectorAll('.size-btn') || [];
        sizeBtns.forEach(btn => btn.classList.remove('active'));

        const activeBtn = this.sizeContainer?.querySelector(`.size-btn[data-size="${sizeID}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }

    renderAddToCartButton() {
        const container = this.popupInfoMain || this.popupBody;
        if (!container) return;

        if (!this.addToCartBtn) {
            this.addToCartBtn = new AddToCartButton({
                parentElement: container,
                getPizzaID: () => this.selectedPizzaID,
                getSizeID: () => this.selectedSizeID,
                getQuantity: () => parseInt(this.quantityDisplay?.textContent) || 1,
                onSuccess: () => this.close()
            });
            this.addToCartBtn.renderButton();
        }
    }

    updatePrice() {
        const multiplier = this.sizeMultipliers[this.selectedSizeID]?.multiplier || 1;
        const quantity = parseInt(this.quantityDisplay?.textContent) || 1;
        const totalPrice = this.basePrice * quantity * multiplier;

        if (this.popupPrice) {
            this.popupPrice.textContent = `${totalPrice.toFixed(2)} €`;
        }
    }

    /** ---------- Event Handlers ---------- */
    handleSizeChange(e) {
        const btn = e.target.closest('.size-btn');
        if (!btn) return;

        this.selectedSizeID = btn.dataset.size;
        this.setActiveSize(this.selectedSizeID);
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