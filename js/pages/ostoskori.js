import { validateCartDom } from '../helpers/domValid.js';
import { fetchCartQuantity, fetchOrderHistory } from '../helpers/api.js';
import { showNotification } from '../helpers/utils.js';
import { Cart } from '../components/ostoskori/Cart.js';
import { CheckoutForm } from '../components/ostoskori/CheckoutForm.js';
import { AddressModal } from '../components/ostoskori/AddressModal.js';
import { HistoryPopup } from '../components/popup/HistoryPopup.js';

export class CartPage {
    constructor() {
        this.DOM = null;
        this.cart = null;
        this.checkoutForm = null;
        this.addressModal = null;
        this.historyPopup = null;

        this.orderLimitHistory = 5;
        this.historyOffset = 0;
        this.cachedHistory = [];
        this.seenOrderIds = new Set();

        const isLoggedInField = document.getElementById('isLoggedIn');
        this.isLoggedIn = isLoggedInField?.value === '1';
    }

    async init() {
        try {
            this.DOM = validateCartDom();
            if (!this.DOM) throw new Error('Required DOM elements not found');

            await this.initializeCart();
            this.initializeAddressModal();
            this.initializeCheckoutForm();
            this.setupHistoryListener();
            this.setupCartListener();

        } catch (err) {
            console.error('Cart page init failed', err);
            showNotification('Sivun lataus epäonnistui', 'error');
        }
    }

    async initializeCart() {
        const { items } = await fetchCartQuantity({ includeItems: true });
        if (items && items.length) this.renderCart(items);
        else this.showEmptyCart();
    }

    renderCart(items) {
        this.cart = new Cart({ container: this.DOM.cartItemContainer, items });
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
            const { items } = await fetchCartQuantity({ includeItems: true });
            if (items && items.length) this.renderCart(items);
            else this.showEmptyCart();
        });
    }

    setupHistoryListener() {
        if (!this.isLoggedIn) {
            this.DOM.historyBtn.style.display = 'none';
            return;
        }

        this.DOM.historyBtn.style.display = 'inline-block';
        this.DOM.historyBtn.addEventListener('click', async () => {
            try {
                // COMPLETE RESET - Clear everything
                this.cachedHistory = [];
                this.seenOrderIds.clear();
                this.historyOffset = 0;

                // Fetch fresh first page from server
                const firstBatch = await fetchOrderHistory(this.orderLimitHistory, 0) || [];
                
                // Add to cache and track IDs
                firstBatch.forEach(order => {
                    if (!this.seenOrderIds.has(order.TilausID)) {
                        this.seenOrderIds.add(order.TilausID);
                        this.cachedHistory.push(order);
                    }
                });
                
                this.historyOffset = this.cachedHistory.length;

                // Create popup if needed
                if (!this.historyPopup) {
                    this.historyPopup = new HistoryPopup();
                    this.historyPopup.init();
                }

                // Open popup with callback
                this.historyPopup.open(this.cachedHistory, {
                    onSeeMore: async () => {
                        const moreOrders = await fetchOrderHistory(this.orderLimitHistory, this.historyOffset);
                        
                        if (!moreOrders || !moreOrders.length) {
                            return { orders: null, hasMore: false };
                        }

                        // Filter out duplicates
                        const newOrders = moreOrders.filter(order => !this.seenOrderIds.has(order.TilausID));
                        
                        if (newOrders.length === 0) {
                            return { orders: null, hasMore: false };
                        }

                        // Add new orders to cache and track their IDs
                        newOrders.forEach(order => {
                            this.seenOrderIds.add(order.TilausID);
                            this.cachedHistory.push(order);
                        });
                        
                        // Update offset
                        this.historyOffset = this.cachedHistory.length;
                        
                        // Keep button visible if we got exactly the limit amount
                        const hasMore = moreOrders.length === this.orderLimitHistory;
                        
                        return { orders: this.cachedHistory, hasMore };
                    }
                });

            } catch (err) {
                console.error('Error loading order history', err);
                showNotification('Tilaushistorian lataus epäonnistui', 'error');
            }
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
                if (this.checkoutForm) this.checkoutForm.updateAddress(address);
            }
        });
    }

    initializeCheckoutForm() {
        const formElement = this.isLoggedIn ? this.DOM.formLoggedIn : this.DOM.formGuest;
        if (!formElement) return;

        this.checkoutForm = new CheckoutForm({
            formElement,
            isLoggedIn: this.isLoggedIn,
            onSubmitSuccess: (customerData, cartItems) => {
                window.location.href = '../pages/kassa.php';
            }
        });
    }
}

// Initialize page
const waitForDOM = () => new Promise(resolve => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
    } else resolve();
});

waitForDOM().then(() => {
    const cartPage = new CartPage();
    cartPage.init();
});