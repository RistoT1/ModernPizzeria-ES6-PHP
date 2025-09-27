import { validateIndexDom } from '../helpers/domValid.js';
import { fetchSizes, fetchPizza, fetchCartQuantity } from '../helpers/api.js';
import { Popup } from '../components/index/Popup.js';
import { Menu } from '../components/index/Menu.js';
import { Recommended } from '../components/index/Recommended.js';
import { updateCartCounter, showNotification } from '../helpers/utils.js';

const initializePage = async () => {
    try {
        // Add small delay to ensure DOM is fully ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const DOM = validateIndexDom();
        if (!DOM) {
            throw new Error('Required DOM elements not found');
        }

        console.log('DOM elements validated successfully');

        const [sizeMultipliers, pizzas, cartQty] = await Promise.all([
            fetchSizes(),
            fetchPizza(),
            fetchCartQuantity()
        ]);

        console.log('Data fetched:', { 
            sizes: Object.keys(sizeMultipliers).length, 
            pizzas: pizzas.length, 
            cartQty 
        });

        const popup = new Popup({ popupElement: DOM.popup, sizeMultipliers});

        if (pizzas.length > 0) {
            new Menu({ container: DOM.menu, pizzas, popup });
            console.log('Menu initialized');
        } else {
            throw new Error('Ei pizzoja ladattavissa - tarkista API-yhteys');
        }

        const recommendedContainer = document.getElementById('recommended');
        if (recommendedContainer && pizzas.length > 0) {
            new Recommended({ container: recommendedContainer, pizzas });
            console.log('Recommended section initialized');
        }


        updateCartCounter(cartQty);
        console.log('Cart quantity updated:', cartQty);

        // Show success notification
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
};


const waitForDOM = () => {
    return new Promise(resolve => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
};


waitForDOM().then(initializePage);