// --- DOM elements validation ---
const validateDOMElements = () => {
    const elements = {
        menu: document.getElementById("menu"),
        popup: document.getElementById('pizzaPopup'),
        popupHeader: document.querySelector('.popup-header'),
        closeBtn: document.getElementById('closePopup'),
        sizeContainer: document.querySelector('.size-options'),
        quantityDisplay: document.getElementById("quantity"),
        qtyContainer: document.querySelector('.quantity-control'),
        addBtn: document.getElementById("addCart")
    };

    for (const [name, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Required DOM element not found: ${name}`);
            return false;
        }
    }
    return elements;
};

// --- DOM elements ---
let DOM = {};

// --- State ---
let selectedPizzaID = null;
let basePizzaPrice = 0;
let selectedSizeID = "2";
let sizeMultipliers = {};

// --- Fetch sizes ---
const fetchSizes = async () => {
    try {
        const res = await fetch('./api/main.php?koko');
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const result = await res.json();
        if (result.success && result.data && Array.isArray(result.data)) {
            result.data.forEach(size => {
                sizeMultipliers[size.KokoID] = {
                    multiplier: parseFloat(size.HintaKerroin),
                    name: size.Nimi,
                    description: size.Kuvaus || ''
                };
            });
            console.log('Sizes loaded:', Object.keys(sizeMultipliers).length);
        } else {
            throw new Error('Invalid sizes response format');
        }
    } catch (err) {
        console.error('Error fetching sizes:', err);
        showNotification('Virhe ladattaessa kokoja', 'error');
    }
};

// --- Update price ---
const updatePrice = () => {
    if (!DOM.popup) return;
    const popupPrice = DOM.popup.querySelector('.popup-price');
    if (!popupPrice) return;

    const multiplier = sizeMultipliers[selectedSizeID]?.multiplier || 1.0;
    popupPrice.textContent = `€${(basePizzaPrice * multiplier).toFixed(2)}`;
};

// --- Open popup ---
const openPopup = (pizza) => {
    if (!DOM.popup || !pizza) return;

    const popupTitle = DOM.popup.querySelector('.popup-title');
    const popupInfo = DOM.popup.querySelector('.popup-info');
    const popupIngredients = DOM.popup.querySelector('.popup-ingredients');

    if (!popupTitle || !popupInfo || !popupIngredients) {
        console.error('Popup elements not found');
        return;
    }

    selectedPizzaID = pizza.PizzaID;
    basePizzaPrice = parseFloat(pizza.Hinta) || 0;
    popupTitle.textContent = pizza.PizzaNimi || '';
    popupInfo.textContent = pizza.Tiedot || '';

    // Safe handling of ingredients
    const ingredients = pizza.Ainesosat;
    if (Array.isArray(ingredients)) {
        popupIngredients.textContent = ingredients.map(ing =>
            typeof ing === 'string' ? ing : (ing.Aineosat || '')
        ).filter(Boolean).join(', ');
    } else if (typeof ingredients === 'string') {
        popupIngredients.textContent = ingredients;
    } else {
        popupIngredients.textContent = '';
    }

    if (DOM.quantityDisplay) {
        DOM.quantityDisplay.textContent = '1';
    }

    // Update size buttons
    const sizeButtons = document.querySelectorAll(".size-btn");
    sizeButtons.forEach(btn => btn.classList.remove('active'));
    const defaultBtn = document.querySelector(`.size-btn[data-size="${selectedSizeID}"]`);
    if (defaultBtn) defaultBtn.classList.add('active');

    // Set background image
    const imgUrl = pizza.Kuva ? `src/img/${pizza.Kuva}` : 'src/img/default-pizza.jpg';
    if (DOM.popupHeader) {
        DOM.popupHeader.style.backgroundImage = `url(${imgUrl})`;
    }

    updatePrice();
    DOM.popup.classList.add('active');
};

const closePopup = () => {
    if (DOM.popup) {
        DOM.popup.classList.remove('active');
    }
};

// --- Size change ---
const handleSizeChange = (e) => {
    const btn = e.target.closest('.size-btn');
    if (!btn) return;

    const sizeButtons = document.querySelectorAll(".size-btn");
    sizeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSizeID = btn.dataset.size;
    updatePrice();
};

// --- Quantity buttons ---
const handleQuantityChange = (e) => {
    const btn = e.target.closest('.qty-btn');
    if (!btn || !DOM.quantityDisplay) return;

    let current = parseInt(DOM.quantityDisplay.textContent) || 1;
    const change = parseInt(btn.dataset.change) || 0;
    current = Math.max(1, Math.min(99, current + change));
    DOM.quantityDisplay.textContent = current;
};

// --- Add to cart ---
const addToCart = async () => {
    if (!selectedPizzaID || !DOM.addBtn) return;

    DOM.addBtn.disabled = true;
    const quantity = parseInt(DOM.quantityDisplay?.textContent) || 1;
    const payload = {
        addItem: true,
        pizzaID: selectedPizzaID,
        quantity: quantity,
        size: selectedSizeID
    };
    console.log(payload);

    try {
        const res = await fetch('./api/main.php?addItem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const result = await res.json();
        if (result.success) {
            showNotification('Lisätty koriin!', 'success');
            await fetchCartQuantity();
            closePopup();
        } else {
            showNotification(result.message || 'Virhe lisättäessä koriin', 'error');
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        showNotification('Verkkovirhe.', 'error');
    } finally {
        DOM.addBtn.disabled = false;
    }
};

// --- Notifications ---
const showNotification = (msg, type = 'info') => {
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => {
        if (n.parentNode) {
            n.parentNode.removeChild(n);
        }
    }, 3000);
};

// --- Cart counter ---
const updateCartCounter = (qty) => {
    const counter = document.querySelector('.cart-counter');
    if (!counter) return;

    const count = parseInt(qty) || 0;
    counter.textContent = count;
    counter.style.display = count > 0 ? 'inline-block' : 'none';
};

// --- Fetch cart ---
const fetchCartQuantity = async () => {
    try {
        const res = await fetch('./api/main.php?kori&includeItems=false');
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        const result = await res.json();
        const quantity = result.success ? (result.data?.totalQuantity || result.totalQuantity || 0) : 0;
        updateCartCounter(quantity);
    } catch (error) {
        console.error('Error fetching cart quantity:', error);
        updateCartCounter(0);
    }
};

// --- Render pizzas ---
const renderPizzas = (pizzas) => {
    if (!DOM.menu || !Array.isArray(pizzas)) {
        console.error('Cannot render pizzas: invalid menu element or pizzas data');
        return;
    }
    console.log(pizzas)
    DOM.menu.innerHTML = '';
    const frag = document.createDocumentFragment();

    pizzas.forEach(pizza => {
        if (!pizza || !pizza.PizzaID) {
            console.warn('Invalid pizza data:', pizza);
            return;
        }

        const div = document.createElement('div');
        div.className = 'menuItem';
        div.id = `pizza-${pizza.PizzaID}`;
        div.addEventListener('click', () => openPopup(pizza));

        const img = document.createElement('img');
        img.className = 'itemImg';
        img.alt = pizza.PizzaNimi || 'Pizza';
        img.src = pizza.Kuva ? `src/img/${pizza.Kuva}` : 'src/img/default-pizza.jpg';
        img.onerror = function () {
            this.src = 'src/img/default-pizza.jpg';
        };

        const content = document.createElement('div');
        content.className = 'itemContent';
        content.innerHTML = `
            <div class="itemHeader">
                <h3 class="itemTitle">${escapeHtml(pizza.PizzaNimi || 'Pizza')}</h3>
                <h3 class="itemPrice">€${parseFloat(pizza.Hinta || 0).toFixed(2)}</h3>
            </div>
            <p class="itemTiedot">${escapeHtml(pizza.Tiedot || '')}</p>
        `;

        div.appendChild(img);
        div.appendChild(content);
        frag.appendChild(div);
    });

    DOM.menu.appendChild(frag);
    console.log(`Rendered ${pizzas.length} pizzas`);
};

// --- Utility function to escape HTML ---
const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// --- Fetch pizzas ---
const fetchPizza = async () => {
    try {
        const res = await fetch('./api/main.php?pizzat');
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const result = await res.json();

        if (result.success && result.data && Array.isArray(result.data)) {
            renderPizzas(result.data);
        } else {
            throw new Error('Invalid pizza data received');
        }
    } catch (error) {
        console.error('Error fetching pizzas:', error);
        if (DOM.menu) {
            DOM.menu.innerHTML = '<p>Virhe ladattaessa pizzoja. <button onclick="location.reload()">Yritä uudelleen</button></p>';
        }
        showNotification('Virhe ladattaessa pizzoja', 'error');
    }
};

// --- Event listeners setup ---
const setupEventListeners = () => {
    // Popup events
    if (DOM.popup) {
        DOM.popup.addEventListener('click', e => {
            if (e.target === DOM.popup) closePopup();
        });
    }

    if (DOM.closeBtn) {
        DOM.closeBtn.addEventListener('click', closePopup);
    }

    // Size change
    if (DOM.sizeContainer) {
        DOM.sizeContainer.addEventListener('click', handleSizeChange);
    }

    // Quantity change
    if (DOM.qtyContainer) {
        DOM.qtyContainer.addEventListener('click', handleQuantityChange);
    }

    // Add to cart
    if (DOM.addBtn) {
        DOM.addBtn.addEventListener('click', addToCart);
    }
};

// --- Init ---
const initializePage = async () => {
    try {
        // Validate DOM elements first
        DOM = validateDOMElements();
        if (!DOM) {
            throw new Error('Required DOM elements not found');
        }

        // Setup event listeners
        setupEventListeners();

        // Fetch data
        console.log('Initializing page...');
        await Promise.all([fetchSizes(), fetchPizza()]);
        await fetchCartQuantity();
        console.log('Page initialization complete');

    } catch (error) {
        console.error('Initialization failed:', error);
        showNotification('Sivun lataus epäonnistui', 'error');
    }
};

// --- Start initialization when DOM is ready ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}