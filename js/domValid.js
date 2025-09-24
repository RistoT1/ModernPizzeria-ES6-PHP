export const validateDOMElements = () => {
    const elements = {
        mainContainer: document.getElementById("mainContainer"),
        menu: document.getElementById("menu"),
        popup: document.getElementById('pizzaPopup'),
        popupHeader: document.querySelector('.popup-header'),
        closeBtn: document.getElementById('closePopup'),
        sizeContainer: document.querySelector('.size-options'),
        quantityDisplay: document.getElementById("quantity"),
        qtyContainer: document.querySelector('.quantity-control'),
    };

    const missing = [];
    for (const [name, element] of Object.entries(elements)) {
        if (!element) {
            missing.push(name);
        }
    }

    if (missing.length > 0) {
        console.error('Missing DOM elements:', missing);
        return null;
    }

    return elements;
};