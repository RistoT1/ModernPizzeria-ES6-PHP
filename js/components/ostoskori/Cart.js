import { renderCartItem } from "./renderCart.js";

export class Cart {
    constructor({ container, items }) {
        this.container = container;
        console.log("Cart container: in cart", this.container);
        this.items = items;
        this.render();
    }
    render() {
        if (!this.container) return;
        if (!this.items?.length) return;
        this.container.innerHTML = '';
        this.items.forEach(item => {
            new renderCartItem({ container: this.container, item: item });
        });
    }
}