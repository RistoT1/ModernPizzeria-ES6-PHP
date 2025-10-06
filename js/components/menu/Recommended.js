import { AddToCartButton } from './AddToCartButton.js';
import { escapeHtml } from '../../helpers/utils.js';
import { getPath } from '../../helpers/config.js';

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
            const pizzaElement = this.createPizzaElement(pizza);
            this.container.appendChild(pizzaElement);

            const parent = pizzaElement.querySelector('.itemContent');
            this.addCartButton(pizza, parent);
        });
    }

    createPizzaElement(pizza) {
        const div = document.createElement('div');
        div.className = 'menuItemLarge';
        div.id = `rec-pizza-${pizza.PizzaID}`;

        const imgContainer = this.createImageContainer(pizza);
        const content = this.createContent(pizza);

        div.appendChild(imgContainer);
        div.appendChild(content);

        return div;
    }

    createImageContainer(pizza) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'itemImg';

        const img = document.createElement('img');
        img.alt = pizza.PizzaNimi || 'Pizza';
        img.src = pizza.Kuva ? `${getPath(false)}/src/img/${pizza.Kuva}` : `${getPath(false)}/src/img/default-pizza.jpg`;
        img.onerror = () => { img.src = `${getPath(false)}/src/img/default-pizza.jpg` };

        imgContainer.appendChild(img);
        return imgContainer;
    }

    createContent(pizza) {
        const content = document.createElement('div');
        content.className = 'itemContent';
        content.innerHTML = `
            <div class="itemHeader">
                <h3 class="itemTitle">${escapeHtml(pizza.PizzaNimi || 'Pizza')}</h3>
                <h3 class="itemPrice">€${parseFloat(pizza.Hinta || 0).toFixed(2)}</h3>
            </div>
            <p class="itemTiedot">${escapeHtml(pizza.Tiedot || '')}</p>
        `;
        return content;
    }

    addCartButton(pizza, parentElement) {
        const btn = new AddToCartButton({
            parentElement,
            getPizzaID: () => pizza.PizzaID || pizza.id,
            getSizeID: () => "2",
            getQuantity: () => 1
        });

        btn.renderButton();
    }
}
