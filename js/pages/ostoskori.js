import { validateCartDom } from '../helpers/domValid.js';
import { fetchCartQuantity } from '../helpers/api.js';
import { showNotification } from '../helpers/utils.js';
import { Cart } from '../components/ostoskori/Cart.js';
import { CheckoutForm } from '../components/ostoskori/CheckoutForm.js';
import { AddressModal } from '../components/ostoskori/AddressModal.js';

class CartPage {
    constructor() {
        this.DOM = null;
        this.cart = null;
        this.checkoutForm = null;
        this.addressModal = null;
    }

    async init() {
        try {
            // Wait for DOM to be ready
            await new Promise(resolve => setTimeout(resolve, 100));

            // Validate DOM elements
            this.DOM = validateCartDom();
            if (!this.DOM) {
                throw new Error('Required DOM elements not found');
            }

            // Initialize components
            await this.initializeCart();
            this.initializeAddressModal();
            this.initializeCheckoutForm();
            this.setupCartListener();

            console.log('Cart page initialized successfully');

        } catch (error) {
            console.error('Cart page initialization failed:', error);
            showNotification('Sivun lataus epäonnistui', 'error');
        }
    }

    async initializeCart() {
        // Show empty state by default
        this.DOM.cartEmptyContainer.style.display = 'block';
        this.DOM.cartItemContainer.style.display = 'none';

        // Fetch cart items
        const { items: cartItems } = await fetchCartQuantity({ includeItems: true });
        console.log('Fetched cart items:', cartItems);

        // Display cart if items exist
        if (cartItems && cartItems.length > 0) {
            this.renderCart(cartItems);
        }
    }

    renderCart(items) {
        if (!items || items.length === 0) {
            this.showEmptyCart();
            return;
        }

        this.cart = new Cart({
            container: this.DOM.cartItemContainer,
            items: items
        });

        this.DOM.cartEmptyContainer.style.display = 'none';
        this.DOM.cartItemContainer.style.display = 'block';
    }

    showEmptyCart() {
        this.DOM.cartItemContainer.innerHTML = '';
        this.DOM.cartItemContainer.style.display = 'none';
        this.DOM.cartEmptyContainer.style.display = 'block';
    }

    setupCartListener() {
        window.addEventListener('cartItemChanged', async () => {
            console.log('Cart changed, refreshing...');

            const { items: updatedItems } = await fetchCartQuantity({ includeItems: true });
            this.renderCart(updatedItems);
        });
    }

    initializeAddressModal() {
        this.addressModal = new AddressModal({
            modalElement: this.DOM.addressModal,
            openBtn: this.DOM.openAddressBtn,
            editBtn: this.DOM.editAddressBtn,
            closeBtn: this.DOM.closeModalBtn,
            saveBtn: this.DOM.saveAddressBtn,
            addressSection: this.DOM.addressSection,
            addressDisplayElement: this.DOM.addressInput,
            streetInput: this.DOM.streetInput,
            cityInput: this.DOM.cityInput,
            postalInput: this.DOM.postalInput,
            onAddressSaved: (address) => {
                console.log('Address saved:', address);
                // Update checkout form with new address
                if (this.checkoutForm) {
                    this.checkoutForm.updateAddress(address);
                }
            }
        });
    }

    initializeCheckoutForm() {
        // Determine if user is logged in
        const isLoggedInField = document.getElementById('isLoggedIn');
        const isLoggedIn = isLoggedInField?.value === '1';

        // Get the appropriate form
        const formElement = isLoggedIn ? this.DOM.formLoggedIn : this.DOM.formGuest;

        if (!formElement) {
            console.warn('No checkout form found');
            return;
        }

        this.checkoutForm = new CheckoutForm({
            formElement: formElement,
            isLoggedIn: isLoggedIn,
            onSubmitSuccess: (customerData, cartItems) => {
                console.log('Checkout submitted:', { customerData, cartItems });
                // Redirect after successful checkout
                window.location.href = '../pages/kassa.php';
            }
        });
    }
}

// Initialize page when DOM is ready
const waitForDOM = () => {
    return new Promise(resolve => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
};

// Start the application
waitForDOM().then(() => {
    const cartPage = new CartPage();
    cartPage.init();
});