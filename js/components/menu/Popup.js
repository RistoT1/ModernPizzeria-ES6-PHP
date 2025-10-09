import { AddToCartButton } from './AddToCartButton.js';
import { validatePopupDom } from '../../helpers/domValid.js';

export class Popup {
    constructor({ sizeMultipliers, extras } = {}) {
        this.sizeMultipliers = sizeMultipliers || {};
        this.extras = extras || {};
        this.selectedPizzaID = null;
        this.selectedSizeID = "2";
        this.basePrice = 0;

        this.addToCartBtn = null;
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

        // Set the popup state first
        this.selectedPizzaID = pizza.PizzaID || pizza.id; // fallback in case of different key
        this.basePrice = parseFloat(pizza.Hinta) || 0;
        this.selectedSizeID = "2";

        this.resetQuantity();
        this.populatePopup(pizza);
        this.renderAddToCartButton(); // create button once
        this.popup.classList.add('active');
        this.updatePrice();
    }

    close() {
        this.popup.classList.remove('active');
        // keep the button, no need to recreate
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
            this.popupHeader.style.backgroundImage = `url(${pizza.Kuva ? `../src/img/${pizza.Kuva}` : '../src/img/default-pizza.jpg'})`;
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
        const container = this.popupInfoMain || this.popupBody;
        if (!container) return;

        if (!this.addToCartBtn) {
            // Create button once
            console.log(this.selectedPizzaID);
            this.addToCartBtn = new AddToCartButton({
                parentElement: container,
                getPizzaID: () => this.selectedPizzaID,
                getSizeID: () => this.selectedSizeID,
                getQuantity: () => parseInt(this.quantityDisplay?.textContent) || 1,
                onSuccess: () => this.close()
            });
            this.addToCartBtn.renderButton();
        }
        // No need to recreate on subsequent opens
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
