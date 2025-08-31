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
const qtyButtons = document.querySelectorAll(".qty-btn");
const addBtn = document.getElementById("addCart");

//valittu pizza
let selectedPizzaID = null;
//pizza hinta
let basePizzaPrice = 0;
//koko ja koon hinnan kerroin (oikea hinta lasketaan käyttäjän ulottumattomissa)
let sizeMultipliers = {};

//Pizzakoko fetch
const fetchSizes = async () => {
    try {
        const response = await fetch('./api/fetchSize.php');
        if (response.ok) {
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
        }
    } catch (err) {
        console.error('Error fetching sizes:', err);
    }
};

//hinnan päivitys
const updatePrice = () => {
    const activeSize = document.querySelector('.size-btn.active');
    if (!activeSize || !basePizzaPrice) return;
    const sizeID = activeSize.dataset.size;
    const multiplier = sizeMultipliers[sizeID]?.multiplier || 1.0;
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

    //poista active 
    sizeButtons.forEach(btn => btn.classList.remove('active'));
    const defaultSize = document.querySelector('.size-btn[data-size="2"]');
    if (defaultSize) defaultSize.classList.add('active');
    updatePrice();
    if (pizza.Kuva) {
        popupHeader.style.backgroundImage = `url(src/img/${pizza.Kuva})`;
        popupHeader.style.backgroundSize = "cover";
        popupHeader.style.backgroundPosition = "center";
    } else {
        popupHeader.style.backgroundImage = "none";
    }
    popup.classList.add('active');
};

const closePopup = () => {
    popup.classList.remove('active');
};

//jos clikataan pelkästään popup overlayhin
//eli popup-contentin ulkopuolelle
popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
});
//sulku nappi
closeBtn.addEventListener('click', closePopup);

//kokonappi
sizeContainer.addEventListener('click', e => {
    const btn = e.target.closest('.size-btn');
    if (!btn) return;
    sizeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updatePrice(btn);
});

for (const button of qtyButtons) {
    button.addEventListener('click', () => {
        let change = parseInt(button.dataset.change);
        let current = parseInt(quantityDisplay.textContent);
        current = Math.max(1, Math.min(99, current + change));
        quantityDisplay.textContent = current;
    });
}

addBtn.addEventListener('click', async () => {
    const quantity = parseInt(quantityDisplay.textContent);
    const sizeButton = document.querySelector('.size-btn.active');
    const size = sizeButton ? sizeButton.dataset.size : null;
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
            console.log('Added to cart successfully:', result);
            showNotification('Lisätty koriin!', 'success');
            updateCartCounter(result.totalQuantity);
            closePopup();
        } else {
            console.error('Failed to add to cart:', result.message);
            showNotification(result.message || 'Virhe lisättäessä koriin', 'error');
        }
    } catch(err) {
        console.error('Error sending data:', err);
        showNotification('Verkkovirhe. Yritä uudelleen.', 'error');
    } finally {
        addBtn.disabled = false;
        addBtn.textContent = originalText;
    }
});

const showNotification = (message, type = 'info') => {
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    `;
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

const updateCartCounter = (totalQuantity) => {
    const cartCounters = document.querySelectorAll('.cart-counter, .cart-count');
    cartCounters.forEach(counter => {
        counter.textContent = totalQuantity;
        if (totalQuantity > 0) counter.style.display = 'inline-block';
    });
};

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
        const pizzas = result.data || [];
        menu.innerHTML = '';
        if (pizzas.length === 0) {
            menu.innerHTML = '<p>Ei pizzoja saatavilla</p>';
            return;
        }
        pizzas.forEach(pizza => {
            const menuItem = document.createElement('div');
            menuItem.className = "menuItem";
            menuItem.id = pizza.PizzaID;
            menuItem.addEventListener('click', () => openPopup(pizza));
            const itemTitle = document.createElement('h3');
            itemTitle.className = "itemTitle";
            itemTitle.textContent = pizza.Nimi || "Pizza";
            const itemPrice = document.createElement('h3');
            itemPrice.className = "itemPrice";
            itemPrice.textContent = pizza.Hinta ? `€${pizza.Hinta}` : "";
            const itemImg = document.createElement('img');
            itemImg.className = "itemImg";
            itemImg.src = `src/img/${pizza.Kuva}` || "";
            itemImg.alt = pizza.Nimi || "Pizza";
            itemImg.onerror = function() { this.src = 'src/img/default-pizza.jpg'; };
            const itemInfo = document.createElement('p');
            itemInfo.className = "itemTiedot";
            itemInfo.textContent = pizza.Tiedot || "";
            const itemContent = document.createElement('div');
            itemContent.className = "itemContent";
            const itemHeader = document.createElement('div');
            itemHeader.className = "itemHeader";
            itemHeader.append(itemTitle, itemPrice);
            itemContent.append(itemHeader, itemInfo);
            menuItem.append(itemImg, itemContent);
            menu.appendChild(menuItem);
        });
    } catch (err) {
        console.error("Error fetching pizzas:", err);
        showNotification('Virhe ladattaessa pizzoja', 'error');
        menu.innerHTML = '<p>Virhe ladattaessa pizzoja. Yritä päivittää sivu.</p>';
    }
};

const initializePage = async () => {
    await fetchSizes();
    await fetchPizza();
};

initializePage();
