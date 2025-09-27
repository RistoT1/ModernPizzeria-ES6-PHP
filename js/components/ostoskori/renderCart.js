export class renderCartItem {
    constructor({ item, container}) {
        this.item = item;
        this.container = container;
        this.render();
    }

    render() {
        if (!this.item || !this.container) return;

        const template = `
            <div class="cartItem" data-cart-id="${this.item.cartRowID}">
                <img 
                    src="../src/img/${this.item.Kuva ?? 'default-pizza.jpg'}"
                    alt="${this.item.PizzaNimi ?? 'Tuote'}"
                />
                <div class="cartItemContent">
                    <h4 class="cartItemTitle">${this.item.Nimi ?? 'Tuote'}</h4>
                    <p class="cartItemSize">Koko: ${this.item.sizeName ?? '-'}</p>
                    <p class="cartItemPrice">${
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
        const el = fragment.querySelector(".cartItem");
        const deleteBtn = el.querySelector(".delete");
        
        deleteBtn.addEventListener("click", () => {
            el.remove();
            dispatchEvent(new CustomEvent("cartItemDeleted", { detail: this.item.cartRowID }));
        });
        

        //so now i can use this event in renderCart to update the cart


        this.container.appendChild(fragment);
    }
}
