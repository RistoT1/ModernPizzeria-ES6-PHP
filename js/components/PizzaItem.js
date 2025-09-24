import { escapeHtml } from '../utils.js';

export class PizzaItem {
    constructor({ pizza, container, openPopupCallback }) {
        this.pizza = pizza;
        this.container = container;
        this.openPopupCallback = openPopupCallback;
        this.render();
    }

    render() {
        const div = document.createElement('div');
        div.className = 'menuItemSmall';
        div.id = `pizza-${this.pizza.PizzaID}`;

        const imgContainer = document.createElement('div');
        imgContainer.className = 'itemImg';

        const img = document.createElement('img');
        img.alt = this.pizza.PizzaNimi || 'Pizza';
        img.src = this.pizza.Kuva ? `src/img/${this.pizza.Kuva}` : 'src/img/default-pizza.jpg';

        let fallbackAttempted = false;
        img.onerror = () => {
            if (!fallbackAttempted) {
                fallbackAttempted = true;
                img.src = 'src/img/default-pizza.jpg';
            }
        };

        // Append image to container
        imgContainer.appendChild(img);

        const content = document.createElement('div');
        content.className = 'itemContent';
        content.innerHTML = `
        <div class="itemHeader">
            <h3 class="itemTitle">${escapeHtml(this.pizza.PizzaNimi || 'Pizza')}</h3>
            <h3 class="itemPrice">€${parseFloat(this.pizza.Hinta || 0).toFixed(2)}</h3>
        </div>
        <p class="itemTiedot">${escapeHtml(this.pizza.Tiedot || '')}</p>
        `;

        // Append container (not img directly) and content
        div.appendChild(imgContainer);
        div.appendChild(content);
        div.addEventListener('click', () => this.openPopupCallback(this.pizza));
        this.container.appendChild(div);
    }
}
