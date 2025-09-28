export class renderCartItem {
    constructor({ item, container}) {
        this.item = item;
        this.container = container;
        this.render();
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
                    <p class="cart-item-price">${
                        new Intl.NumberFormat("fi-FI", {
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
        
        deleteBtn.addEventListener("click", () => {
            el.remove();
            dispatchEvent(new CustomEvent("cartItemDeleted", { detail: this.item.cartRowID }));
        });
        

        //so now i can use this event in renderCart to update the cart


        this.container.appendChild(fragment);
    }
}
