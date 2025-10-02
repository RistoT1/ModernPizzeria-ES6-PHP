import { deleteItemFromCart, updateCartItemQuantity, fetchCartQuantity } from "../../helpers/api.js";
import { checkQuantityLimit, showNotification, updateCartCounter } from "../../helpers/utils.js";

export class renderCartItem {
    constructor({ item, container }) {
        this.item = item;
        this.container = container;
        this.render();
        this.setupEventListeners();
        console.log("Rendered cart item:", this.item);
    }

    setupEventListeners() {
        const el = this.container.querySelector(`.cart-item[data-cart-id="${this.item.cartRowID}"]`);
        if (!el) return;

        const decreaseBtn = el.querySelector(".decrease");
        const increaseBtn = el.querySelector(".increase");
        const quantitySpan = el.querySelector(".cartItemQuantity");
        const deleteBtn = el.querySelector(".delete");

        if (decreaseBtn) {
            decreaseBtn.addEventListener("click", async () => {
                console.log("Decrease clicked for item:", this.item);
                if (this.item.quantity < 1) { return; }
                
                const newQuantity = this.item.quantity - 1;
                const success = await updateCartItemQuantity(this.item.cartRowID, newQuantity);
                if (success) {
                    this.item.quantity = newQuantity;
                    quantitySpan.textContent = this.item.quantity;

                    // Update cart counter
                    const cartQty = await fetchCartQuantity();
                    updateCartCounter(cartQty);

                    // Dispatch event for cart refresh
                    window.dispatchEvent(new CustomEvent("cartItemChanged", { detail: this.item }));
                } else {
                    showNotification('Virhe päivitettäessä määrää', 'error');
                }

            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener("click", async () => {
                console.log('Increase clicked');

                const quantityToAdd = 1;
                const currentQuantity = this.item.quantity;
                const newQuantity = currentQuantity + quantityToAdd;

                // Check quantity limit
                const limitExceeded = await checkQuantityLimit(
                    () => quantityToAdd,
                    fetchCartQuantity,
                    showNotification,
                    () => { }
                );

                console.log('Limit exceeded:', limitExceeded);
                if (limitExceeded) return;

                const success = await updateCartItemQuantity(this.item.cartRowID, newQuantity);
                console.log('Update result:', success);

                if (success) {
                    this.item.quantity = newQuantity;
                    quantitySpan.textContent = this.item.quantity;

                    // Update cart counter
                    const cartQty = await fetchCartQuantity();
                    updateCartCounter(cartQty);

                    // Dispatch event for cart refresh
                    window.dispatchEvent(new CustomEvent("cartItemChanged", { detail: this.item }));
                } else {
                    showNotification('Virhe päivitettäessä määrää', 'error');
                }
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener("click", async () => {
                if (!confirm('Haluatko varmasti poistaa tämän tuotteen?')) {
                    return;
                }

                const success = await deleteItemFromCart(this.item);
                if (success) {
                    console.log("Item deleted successfully");
                    el.remove();

                    // Update cart counter
                    const cartQty = await fetchCartQuantity();
                    updateCartCounter(cartQty);

                    showNotification('Tuote poistettu', 'success');

                    // Dispatch event for cart refresh
                    window.dispatchEvent(new CustomEvent("cartItemChanged", { detail: this.item.cartRowID }));
                } else {
                    console.error("Failed to delete item from backend");
                    showNotification('Virhe poistettaessa tuotetta', 'error');
                }
            });
        }
    }

    render() {
        if (!this.item || !this.container) return;

        const template = `
            <div class="cart-item" data-cart-id="${this.item.cartRowID}">
                <img 
                    src="../src/img/${this.item.Kuva ?? 'default-pizza.jpg'}"
                    alt="${this.item.PizzaNimi ?? 'Tuote'}"
                    onerror="this.src='../src/img/default-pizza.jpg'"
                />
                <div class="cart-item-content">
                    <h4 class="cart-item-title">${this.item.Nimi ?? 'Tuote'}</h4>
                    <p class="cart-item-size">Koko: ${this.item.sizeName ?? '-'}</p>
                    <p class="cart-item-price">${this.item.totalPrice}€</p>
                    
                    <div class="cartItemActions">
                        <button class="decrease" aria-label="Vähennä määrää">−</button>
                        <span class="cartItemQuantity">${this.item.quantity ?? 0}</span>
                        <button class="increase" aria-label="Lisää määrää">+</button>
                        <button class="delete" aria-label="Poista tuote">🗑</button>
                    </div>
                </div>
            </div>
        `;

        const fragment = document.createRange().createContextualFragment(template);
        this.container.appendChild(fragment);
    }
}