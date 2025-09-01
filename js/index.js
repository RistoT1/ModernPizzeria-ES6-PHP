//indexsivun objektit
const menu = document.getElementById("menu");
const popup = document.getElementById('pizzaPopup');
const popupHeader = document.querySelector('.popup-header');
const popupTitle = popup.querySelector('.popup-title');
const popupPrice = popup.querySelector('.popup-price');
const popupIncredient = popup.querySelector('.popup-ingredients');
const popupInfo = popup.querySelector('.popup-info');
const closeBtn = document.getElementById('closePopup');
const sizeContainer = document.querySelector('.size-options');
const sizeButtons = document.querySelectorAll(".size-btn");
const quantityDisplay = document.getElementById("quantity");
const qtyContainer = document.querySelector('.quantity-control'); // wrapper for qty buttons
const addBtn = document.getElementById("addCart");

//valittu pizza
let selectedPizzaID = null;
//pizza hinta
let basePizzaPrice = 0;
//koko ja koon hinnan kerroin (oikea hinta lasketaan käyttäjän ulottumattomissa)
let sizeMultipliers = {};
//valittu koko
let selectedSizeID = "2"; // oletuskoko

//Pizzakoko fetch
const fetchSizes = async () => {
    try {
        const response = await fetch('./api/fetchSize.php');
        if (!response.ok) throw new Error('Network error fetching sizes');
        const result = await response.json();
        if (result.data) {
            result.data.forEach(size => {
                sizeMultipliers[size.KokoID] = {
                    multiplier: parseFloat(size.HintaKerroin),
                    name: size.Nimi,
                    description: size.Kuvaus
                };
            });
        }
    } catch (err) {
        console.error('Error fetching sizes:', err);
    }
};

//hinnan päivitys
const updatePrice = () => {
    const multiplier = sizeMultipliers[selectedSizeID]?.multiplier || 1.0;
    const finalPrice = basePizzaPrice * multiplier;
    popupPrice.textContent = `€${finalPrice.toFixed(2)}`;
};

//klikattaessa popup tietojen lisäys
const openPopup = (pizza) => {
    //tietojen lisäys
    selectedPizzaID = pizza.PizzaID;
    basePizzaPrice = parseFloat(pizza.Hinta) || 0;
    popupTitle.textContent = pizza.Nimi || "Pizza";
    popupInfo.textContent = pizza.Tiedot || "";
    popupIncredient.textContent = pizza.Ainesosat || "";
    quantityDisplay.textContent = '1';

    //poista active size
    sizeButtons.forEach(btn => btn.classList.remove('active'));
    const defaultSizeBtn = document.querySelector(`.size-btn[data-size="${selectedSizeID}"]`);
    if (defaultSizeBtn) defaultSizeBtn.classList.add('active');

    updatePrice();

    //popup-kuva
    if (pizza.Kuva) {
        popupHeader.style.backgroundImage = `url(src/img/${pizza.Kuva})`;
        popupHeader.style.backgroundSize = "cover";
        popupHeader.style.backgroundPosition = "center";
    } else {
        popupHeader.style.backgroundImage = "none";
    }

    popup.classList.add('active');
};

//sulje popup
const closePopup = () => {
    popup.classList.remove('active');
};

//jos clickataan pelkästään popup overlayhin
popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
});

//sulku nappi
closeBtn.addEventListener('click', closePopup);

//kokonapit event delegation
sizeContainer.addEventListener('click', e => {
    const btn = e.target.closest('.size-btn');
    if (!btn) return;
    sizeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSizeID = btn.dataset.size;
    updatePrice();
});

//määränapit event delegation
qtyContainer.addEventListener('click', e => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;
    let change = parseInt(btn.dataset.change);
    let current = parseInt(quantityDisplay.textContent);
    current = Math.max(1, Math.min(99, current + change));
    quantityDisplay.textContent = current;
});

//korinlisäys
addBtn.addEventListener('click', async () => {
    const quantity = parseInt(quantityDisplay.textContent);
    const size = selectedSizeID;
    if (!selectedPizzaID) return;

    addBtn.disabled = true;
    const originalText = addBtn.textContent;
    addBtn.textContent = 'Lisätään...';

    const data = { pizzaID: selectedPizzaID, quantity, size };
    console.log('Sending to cart:', JSON.stringify(data));

    try {
        const response = await fetch('api/addToCart.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.success) {
            showNotification('Lisätty koriin!', 'success');
            fetchCartQuantity();
            closePopup();
        } else {
            console.error('Failed to add to cart:', result.message);
            showNotification(result.message || 'Virhe lisättäessä koriin', 'error');
        }
    } catch (err) {
        console.error('Error sending data:', err);
        showNotification('Verkkovirhe. Yritä uudelleen.', 'error');
    } finally {
        addBtn.disabled = false;
        addBtn.textContent = originalText;
    }
});

//ilmoitus 
const showNotification = (message, type = 'info') => {
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
    }, 3000);
};

//päivitä korin counter
const updateCartCounter = (totalQuantity) => {
    const counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.textContent = totalQuantity;
        counter.style.display = totalQuantity > 0 ? 'inline-block' : 'none';
    }
};

//fetchaa kori
const fetchCartQuantity = async () => {
    try {
        const response = await fetch('api/fetchCart.php?count=1');
        if (!response.ok) return updateCartCounter(0);

        const result = await response.json();
        if (result.success) {
            updateCartCounter(result.totalQuantity || 0);
        } else {
            updateCartCounter(0);
        }
    } catch (err) {
        console.error('Error fetching cart quantity:', err);
        updateCartCounter(0);
    }
};

//pitsojen renderöinti
const renderPizzas = (pizzas) => {
    menu.innerHTML = '';
    if (!pizzas.length) {
        menu.innerHTML = '<p>Ei pizzoja saatavilla</p>';
        return;
    }
    //vähentää sivun päivitystä
    //on ns näkymätön laatikko
    const fragment = document.createDocumentFragment();

    pizzas.forEach(pizza => {
        const menuItem = document.createElement('div');
        menuItem.className = "menuItem";
        menuItem.id = pizza.PizzaID;
        menuItem.addEventListener('click', () => openPopup(pizza));

        const imgSrc = pizza.Kuva ? `src/img/${pizza.Kuva}` : 'src/img/default-pizza.jpg';

        menuItem.innerHTML = `
            <img class="itemImg" src="${imgSrc}" alt="${pizza.Nimi || 'Pizza'}">
            <div class="itemContent">
                <div class="itemHeader">
                    <h3 class="itemTitle">${pizza.Nimi || 'Pizza'}</h3>
                    <h3 class="itemPrice">${pizza.Hinta ? `€${pizza.Hinta}` : ''}</h3>
                </div>
                <p class="itemTiedot">${pizza.Tiedot || ''}</p>
            </div>
        `;

        menuItem.querySelector('.itemImg').onerror = () => {
            menuItem.querySelector('.itemImg').src = 'src/img/default-pizza.jpg';
        };

        fragment.appendChild(menuItem);
    });

    menu.appendChild(fragment);
};

//fetchaa pizza
const fetchPizza = async () => {
    try {
        const response = await fetch('./api/fetchPizza.php');
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Network response was not ok.', errorData.message || '');
            showNotification('Virhe ladattaessa pizzoja', 'error');
            return;
        }
        const result = await response.json();
        renderPizzas(result.data || []);
    } catch (err) {
        console.error("Error fetching pizzas:", err);
        showNotification('Virhe ladattaessa pizzoja', 'error');
        menu.innerHTML = '<p>Virhe ladattaessa pizzoja. Yritä päivittää sivu.</p>';
    }
};

//initialize page
const initializePage = async () => {
    await Promise.all([fetchSizes(), fetchPizza()]);
    fetchCartQuantity();
};

initializePage();
