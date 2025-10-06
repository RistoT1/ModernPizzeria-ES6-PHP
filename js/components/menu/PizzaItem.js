import { getPath } from '../../helpers/config.js';
import { escapeHtml } from '../../helpers/utils.js';

export class PizzaItem {
    constructor({ pizza, container, openPopupCallback }) {
        this.pizza = pizza;
        this.container = container;
        this.openPopupCallback = openPopupCallback;
        this.element = null; // store the main element
        this.render();
    }

    render() {
        const div = document.createElement('div');
        div.className = 'menuItemSmall';
        div.id = `pizza-${this.pizza.PizzaID}`;
        this.element = div;

        const imgContainer = this.createImageContainer();
        const content = this.createContent();

        div.appendChild(imgContainer);
        div.appendChild(content);
        div.addEventListener('click', () => this.openPopupCallback(this.pizza));

        this.container.appendChild(div);
    }

    createImageContainer() {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'itemImg';

        const img = document.createElement('img');
        img.alt = this.pizza.PizzaNimi || 'Pizza';
        img.src = this.pizza.Kuva ? `${getPath(false)}/src/img/${this.pizza.Kuva}` : `${getPath(false)}/src/img/default-pizza.jpg`;

        let fallbackAttempted = false;
        img.onerror = () => {
            if (!fallbackAttempted) {
                fallbackAttempted = true;
                img.src = 'src/img/default-pizza.jpg';
            }
        };

        imgContainer.appendChild(img);
        return imgContainer;
    }

    createContent() {
        const content = document.createElement('div');
        content.className = 'itemContent';
        content.innerHTML = `
        <div class="itemHeader">
            <h3 class="itemTitle">${escapeHtml(this.pizza.PizzaNimi || 'Pizza')}</h3>
            <h3 class="itemPrice">€${parseFloat(this.pizza.Hinta || 0).toFixed(2)}</h3>
        </div>
        <p class="itemTiedot">${escapeHtml(this.pizza.Tiedot || '')}</p>
        `;
        return content;
    }
}
