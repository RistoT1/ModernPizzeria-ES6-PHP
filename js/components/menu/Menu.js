import { PizzaItem } from './PizzaItem.js';

export class Menu {
    constructor({ container, pizzas, popup }) {
        this.container = container;
        this.pizzas = pizzas;
        this.popup = popup;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.pizzas.forEach(pizza => {
            new PizzaItem({
                pizza,
                container: this.container,
                openPopupCallback: (pizza) => this.popup.open(pizza)
            });
        });
    }
}
