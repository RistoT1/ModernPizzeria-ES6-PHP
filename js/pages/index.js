import { validateIndexDom } from '../helpers/domValid.js';
import { fetchSizes, fetchPizza } from '../helpers/api.js';
import { Popup } from '../components/index/Popup.js';
import { Menu } from '../components/index/Menu.js';
import { Recommended } from '../components/index/Recommended.js';
import { showNotification } from '../helpers/utils.js';

class IndexPage {
    constructor() {
        this.DOM = null;
        this.popup = null;
        this.menu = null;
        this.recommended = null;
        this.pizzas = [];
        this.sizeMultipliers = {};
    }

    async init() {
        try {
            await new Promise(resolve => setTimeout(resolve, 100));

            this.DOM = validateIndexDom();
            if (!this.DOM) {
                throw new Error('Required DOM elements not found');
            }

            console.log('DOM elements validated successfully');
            await this.initializeMenu();

            showNotification('Sivun lataus onnistui!', 'success');
        } catch (error) {
            console.error('Error initializing page:', error);
            showNotification('Virhe sivun latauksessa', 'error');

            const menuContainer = document.getElementById('menu');
            if (menuContainer) {
                menuContainer.innerHTML = `
                <div class="error-message">
                    <p>Virhe ladattaessa sivua. Yritä päivittää sivu.</p>
                    <button onclick="location.reload()">Päivitä sivu</button>
                </div>
                `;
            }
        }
    }

    async initializeMenu() {
        const [sizeMultipliers, pizzas] = await Promise.all([
            fetchSizes(),
            fetchPizza()
        ]);

        this.sizeMultipliers = sizeMultipliers;
        this.pizzas = pizzas;

        console.log('Data fetched:', {
            sizes: Object.keys(this.sizeMultipliers).length,
            pizzas: this.pizzas.length
        });

        if (this.pizzas.length <= 0) {
            throw new Error('Ei pizzoja ladattavissa - tarkista API-yhteys');
        }

        this.popup = new Popup({
            popupElement: this.DOM.popup,
            sizeMultipliers: this.sizeMultipliers
        });
        this.popup.init();

        this.menu = new Menu({
            container: this.DOM.menu,
            pizzas: this.pizzas,
            popup: this.popup
        });

        console.log('Menu initialized');

        this.initializeRecommended();
    }

    initializeRecommended() {
        const recommendedContainer = document.getElementById('recommended');
        if (recommendedContainer && this.pizzas.length > 0) {
            this.recommended = new Recommended({
                container: recommendedContainer,
                pizzas: this.pizzas
            });
            console.log('Recommended section initialized');
        }
    }
}

const waitForDOM = () => {
    return new Promise(resolve => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
};

waitForDOM().then(() => {
    const indexPage = new IndexPage();
    indexPage.init();
});
