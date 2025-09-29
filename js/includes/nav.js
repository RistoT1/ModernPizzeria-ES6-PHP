import { logoutUser, fetchCartQuantity } from '../helpers/api.js';
import { validateNavDom } from '../helpers/domValid.js';
import { updateCartCounter } from '../helpers/utils.js';

const initializeInclude = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 100));

        const DOM = validateNavDom();
        if (!DOM) {
            throw new Error('Required DOM elements not found');
        }

        setupEventListeners(DOM);

        // Fetch cart quantity and update counter
        const cartQty = await fetchCartQuantity();
        updateCartCounter(cartQty);

    } catch (err) {
        console.error('Initialization error:', err);
    }
};

const setupEventListeners = (DOM) => {
    const logoutBtn = DOM.logoutBtn;
    if (!logoutBtn) return; 

    logoutBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to logout?')) return;

        const success = await logoutUser();
        if (success) {
            window.location.href = './index.php';
        } else {
            alert('Logout failed. Please try again.');
        }
    });
};

initializeInclude();
