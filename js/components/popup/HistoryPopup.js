import { Popup } from './Popup.js';

export class HistoryPopup extends Popup {
    constructor() {
        super();
        this.orders = [];
        this.onSeeMoreCallback = null;
        this.hasMoreOrders = true;
        this.seeMoreBtn = null;
    }

    cacheDOM() {
        super.cacheDOM();
        const { historyContainer } = this.DOM;
        Object.assign(this, { historyContainer });
    }

    bindEvents() {
        super.bindEvents();
    }

    open(orders, options = {}) {
        this.orders = orders || [];
        this.onSeeMoreCallback = options.onSeeMore || null;
        this.hasMoreOrders = true; // Always show button initially, let callback determine if there's more
        this.seeMoreBtn = null;
        this.populateOrderHistory();
        super.open(orders);
    }

    populateOrderHistory() {
        // ALWAYS clear container first - remove ALL content including buttons
        this.historyContainer.innerHTML = '';
        
        if (!this.orders || this.orders.length === 0) {
            this.historyContainer.innerHTML = '<p>No order history available.</p>';
            return;
        }

        // Render orders
        const ordersHTML = this.orders
            .map(order => `
            <div class="order-item">
                <strong>Tilaus #${order.TilausID} — ${order.TilausPvm}</strong>
                <ul>
                    ${order.Pizzat.map(pizza => `
                        <li>${pizza.Nimi} x${pizza.Maara} — ${pizza.RiviHinta}€</li>
                    `).join('')}
                </ul>
                <p>Tuottetta Määrä: ${order.YhteensaMaara}  Kokonais hinta — ${order.YhteensaHinta.toFixed(2)}€</p>
            </div>
        `).join('');

        this.historyContainer.innerHTML = ordersHTML;

        // Add See More button
        this.updateSeeMoreButton();
    }

    updateSeeMoreButton() {
        // Remove existing button if present
        if (this.seeMoreBtn && this.seeMoreBtn.parentNode) {
            this.seeMoreBtn.remove();
        }
        this.seeMoreBtn = null;

        // Add See More button if callback exists and there might be more orders
        if (this.onSeeMoreCallback && this.hasMoreOrders) {
            this.seeMoreBtn = document.createElement('button');
            this.seeMoreBtn.textContent = 'See More';
            this.seeMoreBtn.classList.add('see-more-btn');
            this.historyContainer.appendChild(this.seeMoreBtn);

            this.seeMoreBtn.onclick = async () => {
                this.seeMoreBtn.disabled = true;
                this.seeMoreBtn.textContent = 'Loading...';

                try {
                    const result = await this.onSeeMoreCallback();

                    if (result && result.orders && result.orders.length > 0) {
                        // Replace entire orders array with updated one
                        this.orders = result.orders;
                        this.hasMoreOrders = result.hasMore;
                        this.populateOrderHistory();
                    } else {
                        this.hasMoreOrders = false;
                        this.seeMoreBtn.style.display = 'none';
                    }
                } catch (error) {
                    console.error('Error loading more orders:', error);
                    this.seeMoreBtn.textContent = 'Error - Try Again';
                    this.seeMoreBtn.disabled = false;
                }
            };
        }
    }

    close() {
        super.close();
        this.orders = [];
        this.hasMoreOrders = true;
        if (this.seeMoreBtn && this.seeMoreBtn.parentNode) {
            this.seeMoreBtn.remove();
        }
        this.seeMoreBtn = null;
    }
}