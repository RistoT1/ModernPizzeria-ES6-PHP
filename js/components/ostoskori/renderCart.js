import { deleteItemFromCart, updateCartItemQuantity, fetchCartQuantity } from "../../helpers/api.js";
import { checkQuantityLimit, showNotification } from "../../helpers/utils.js";

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

        decreaseBtn.addEventListener("click", async () => {
            console.log("Decrease clicked for item:", this.item);
            if (this.item.quantity > 1) {
                const newQuantity = this.item.quantity - 1;
                const success = await updateCartItemQuantity(this.item.cartRowID, newQuantity);
                if (success) {
                    this.item.quantity = newQuantity;
                    quantitySpan.textContent = this.item.quantity;
                    dispatchEvent(new CustomEvent("cartItemChanged", { detail: this.item }));
                }
            }
        });

        increaseBtn.addEventListener("click", async () => {
            console.log('clicked');

            const quantityToAdd = 1;
            const currentQuantity = this.item.quantity; // existing quantity
            const newQuantity = currentQuantity + quantityToAdd;

            const limitExceeded = await checkQuantityLimit(
                () => quantityToAdd, // only the quantity we want to add
                fetchCartQuantity,
                showNotification,
                () => { }
            );

            console.log(limitExceeded);
            if (limitExceeded) return;

            const success = await updateCartItemQuantity(this.item.cartRowID, newQuantity)
            console.log(this.item.cartRowID, newQuantity);
            if (success) {
                this.item.quantity = newQuantity;
                quantitySpan.textContent = this.item.quantity;
                dispatchEvent(new CustomEvent("cartItemChanged", { detail: this.item }));
            }
        });
        deleteBtn.addEventListener("click", async () => {
            const success = await deleteItemFromCart(this.item);
            if (success) {
                console.log("Item deleted successfully");
                el.remove();
                dispatchEvent(new CustomEvent("cartItemChanged", { detail: this.item.cartRowID }));
            }
            else {
                console.error("Failed to delete item from backend");
            }
        });
    }

    render() {
        if (!this.item || !this.container) return;

        const template = `
            <div class="cart-item" data-cart-id="${this.item.cartRowID}">
                <img 
                    src="../src/img/${this.item.Kuva ?? 'default-pizza.jpg'}"
                    alt="${this.item.PizzaNimi ?? 'Tuote'}"
                />
                <div class="cart-item-content">
                    <h4 class="cart-item-title">${this.item.Nimi ?? 'Tuote'}</h4>
                    <p class="cart-item-size">Koko: ${this.item.sizeName ?? '-'}</p>
                    <p class="cart-item-price">${new Intl.NumberFormat("fi-FI", {
            style: "currency",
            currency: "EUR",
        }).format(this.item.totalPrice ?? 0)
            }</p>
                    
                    <div class="cartItemActions">
                        <button class="decrease">−</button>
                        <span class="cartItemQuantity">${this.item.quantity ?? 0}</span>
                        <button class="increase">+</button>
                        <button class="delete">🗑</button>
                    </div>
                </div>
            </div>
        `;

        const fragment = document.createRange().createContextualFragment(template);

        // Attach events
        const el = fragment.querySelector(".cart-item");
        const deleteBtn = el.querySelector(".delete");





        this.container.appendChild(fragment);
    }
}
