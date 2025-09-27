import { AddToCartButton } from './AddToCartButton.js';
import { escapeHtml } from '../../helpers/utils.js';

export class Recommended {
    constructor({ container, pizzas }) {
        this.container = container;
        this.pizzas = pizzas;
        this.render();
    }

    render() {
        if (!this.container || !this.pizzas) return;

        this.container.innerHTML = '';

        this.pizzas.slice(0, 2).forEach(pizza => {
            const div = document.createElement('div');
            div.className = 'menuItemLarge';
            div.id = `rec-pizza-${pizza.PizzaID}`;

            // Create image container div
            const imgContainer = document.createElement('div');
            imgContainer.className = 'itemImg';

            // Create the actual image
            const img = document.createElement('img');
            img.alt = pizza.PizzaNimi || 'Pizza';
            img.src = pizza.Kuva ? `src/img/${pizza.Kuva}` : 'src/img/default-pizza.jpg';
            img.onerror = () => { img.src = 'src/img/default-pizza.jpg'; };

            // Append image to container
            imgContainer.appendChild(img);

            const content = document.createElement('div');
            content.className = 'itemContent';
            content.innerHTML = `
                <div class="itemHeader">
                    <h3 class="itemTitle">${escapeHtml(pizza.PizzaNimi || 'Pizza')}</h3>
                    <h3 class="itemPrice">€${parseFloat(pizza.Hinta || 0).toFixed(2)}</h3>
                </div>
                <p class="itemTiedot">${escapeHtml(pizza.Tiedot || '')}</p>
            `;

            // Append container (not img directly) and content
            div.appendChild(imgContainer);
            div.appendChild(content);
            this.container.appendChild(div);

            new AddToCartButton({
                parentElement: content,
                pizzaID: pizza.PizzaID,
                getSizeID: () => "2",
                getQuantity: () => 1
            });
        });
    }
}