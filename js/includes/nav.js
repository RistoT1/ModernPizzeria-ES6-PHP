import { logoutUser, fetchCartQuantity } from '../helpers/api.js';
import { getPath } from '../helpers/config.js';
import { validateNavDom } from '../helpers/domValid.js';
import { updateCartCounter } from '../helpers/utils.js';

class NavInclude {
    constructor() {
        this.DOM = null;
        this.cartQuantity = 0;
        this.init();
    }
    async init() {
        this.DOM = validateNavDom();
        if (!this.DOM) {
            console.error('Required DOM elements not found');
            return;
        }
        this.setupEventListeners();
        this.cartQuantity = await fetchCartQuantity();
        updateCartCounter(this.cartQuantity);
    }
    setupEventListeners() {
        const logoutBtn = this.DOM.logoutBtn;
        if (!logoutBtn) return;


        logoutBtn.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to logout?')) return;

            const success = await logoutUser();
            if (success) {
                window.location.href = `${getPath(false)}/index.php`;
            } else {
                alert('Logout failed. Please try again.');
            }
        });

        const Navbar = this.DOM.nav;
        if (!Navbar) {return;}
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                console.log('scrolled');
                Navbar.classList.add('scrolled');
            } else {
                Navbar.classList.remove('scrolled');
            }
        });
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
    new NavInclude();
});
