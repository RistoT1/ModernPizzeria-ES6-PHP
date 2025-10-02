import { AddToCartButton } from './AddToCartButton.js';
import { validatePopupDom } from '../../helpers/domValid.js';

export class Popup {
    constructor({ sizeMultipliers }) {
        // Basic properties only
        this.sizeMultipliers = sizeMultipliers || {};
        this.selectedPizzaID = null;
        this.selectedSizeID = "2";
        this.basePrice = 0;
        this.addToCartBtn = null;

        // DOM references will be cached later
        this.DOM = {};
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
    }

    /** ---------- DOM Caching ---------- */
    cacheDOM() {
        const DOM = validatePopupDom();
        if (!DOM) throw new Error('Popup DOM not found');

        this.DOM = DOM;

        // Destructure for convenience
        const {
            popup, popupHeader, closeBtn, sizeContainer, qtyContainer,
            quantityDisplay, popupTitle, popupInfo, popupIngredients,
            popupPrice, popupInfoMain, popupBody
        } = DOM;

        Object.assign(this, {
            popup, popupHeader, closeBtn, sizeContainer, qtyContainer,
            quantityDisplay, popupTitle, popupInfo, popupIngredients,
            popupPrice, popupInfoMain, popupBody
        });
    }

    /** ---------- Event Binding ---------- */
    bindEvents() {
        if (!this.popup) return;

        this.popup.addEventListener('click', e => {
            if (e.target === this.popup) this.close();
        });

        this.closeBtn?.addEventListener('click', () => this.close());
        this.sizeContainer?.addEventListener('click', e => this.handleSizeChange(e));
        this.qtyContainer?.addEventListener('click', e => this.handleQuantityChange(e));
    }

    /** ---------- Popup Controls ---------- */
    open(pizza) {
        if (!pizza) return;

        this.selectedPizzaID = pizza.PizzaID;
        this.basePrice = parseFloat(pizza.Hinta) || 0;
        this.selectedSizeID = "2";

        this.resetQuantity();
        this.populatePopup(pizza);
        this.renderAddToCartButton();
        this.popup.classList.add('active');
        this.updatePrice();
    }

    close() {
        this.popup.classList.remove('active');
        this.addToCartBtn?.removeButton?.();
        this.addToCartBtn = null;
    }

    /** ---------- Helpers ---------- */
    resetQuantity() {
        if (this.quantityDisplay) this.quantityDisplay.textContent = '1';
    }

    populatePopup(pizza) {
        if (this.popupTitle) this.popupTitle.textContent = pizza.PizzaNimi || '';
        if (this.popupInfo) this.popupInfo.textContent = pizza.Tiedot || '';
        if (this.popupIngredients) {
            this.popupIngredients.textContent = Array.isArray(pizza.Ainesosat)
                ? pizza.Ainesosat.join(', ')
                : pizza.Ainesosat || '';
        }
        if (this.popupHeader) {
            this.popupHeader.style.backgroundImage = `url(${pizza.Kuva ? `src/img/${pizza.Kuva}` : 'src/img/default-pizza.jpg'})`;
        }

        this.setActiveSize('2');
    }

    setActiveSize(sizeID) {
        const sizeBtns = this.sizeContainer?.querySelectorAll('.size-btn') || [];
        sizeBtns.forEach(btn => btn.classList.remove('active'));

        const defaultBtn = this.sizeContainer?.querySelector(`.size-btn[data-size="${sizeID}"]`);
        if (defaultBtn) defaultBtn.classList.add('active');
    }

    renderAddToCartButton() {
        this.addToCartBtn?.removeButton?.();

        const container = this.popupInfoMain || this.popupBody;
        if (!container) return;

        this.addToCartBtn = new AddToCartButton({
            parentElement: container,
            pizzaID: this.selectedPizzaID,
            getSizeID: () => this.selectedSizeID,
            getQuantity: () => parseInt(this.quantityDisplay?.textContent) || 1,
            onSuccess: () => this.close()
        });
        this.addToCartBtn.renderButton?.();
    }

    /** ---------- Price Calculation ---------- */
    updatePrice() {
        const multiplier = this.sizeMultipliers[this.selectedSizeID]?.multiplier || 1;
        const quantity = parseInt(this.quantityDisplay?.textContent) || 1;
        const totalPrice = this.basePrice * quantity * multiplier;

        if (this.popupPrice) this.popupPrice.textContent = `${totalPrice.toFixed(2)} €`;
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
