const menu = document.getElementById("menu");
const popup = document.getElementById('pizzaPopup');
const popupHeader = document.querySelector('.popup-header');
const popupTitle = popup.querySelector('.popup-title');
const popupPrice = popup.querySelector('.popup-price');
const popupIncredient = popup.querySelector('.popup-ingredients')
const popupInfo = popup.querySelector('.popup-info');
const closeBtn = document.getElementById('closePopup');

const openPopup = (pizza) => {
    popupTitle.textContent = pizza.Nimi || "Pizza";
    popupPrice.textContent = pizza.Hinta ? `€${pizza.Hinta}` : "";
    popupInfo.textContent = pizza.Tiedot || "";
    popupIncredient.textContent = pizza.Ainesosat || "";
    
     if (pizza.Kuva) {
        popupHeader.style.backgroundImage = `url(src/img/${pizza.Kuva})`;
        popupHeader.style.backgroundSize = "cover";
        popupHeader.style.backgroundPosition = "center";
    } else {
        popupHeader.style.backgroundImage = "none";
    }

    popup.classList.add('active'); // Show popup via CSS class
};

const closePopup = () => {
    popup.classList.remove('active');
};

popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        closePopup();
    }
});

closeBtn.addEventListener('click', closePopup);

const fetchPizza = async () => {
    try {
        const response = await fetch('./api/fetchIndex.php');
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Network response was not ok.', errorData.message || '');
            return;
        }

        const result = await response.json();
        const pizzas = result.data || [];
        menu.innerHTML = '';

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
            itemPrice.textContent = `${pizza.Hinta}€` || "";

            const itemImg = document.createElement('img');
            itemImg.className = "itemImg";
            itemImg.src = `src/img/${pizza.Kuva}` || "";
            itemImg.alt = pizza.Nimi || "Pizza";

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
        console.error("Error creating menu item:", err);
    }
};

fetchPizza();
