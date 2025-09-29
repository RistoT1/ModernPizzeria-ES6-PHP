export const validateIndexDom = () => {
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

    if (!checkMissingElements(elements)) {
        return null;
    }

    return elements;
};

export const validateCartDom = () => {
    const elements = {
        cartItemContainer: document.getElementById("cartItems"),
        cartEmptyContainer: document.getElementById("cartEmpty"),
        formGuest: document.getElementById("info-form-guest"),
        formLoggedIn: document.getElementById("info-form-loggedin"),
        addressModal: document.getElementById("addressModal"),
        openAddressBtn: document.getElementById("openAddressModalBtn"),
        editAddressBtn: document.getElementById("editAddressBtn"),
        closeModalBtn: document.getElementById("closeModal"),
        addressSection: document.getElementById("addressSection"),
        addressInput: document.getElementById("addressInput"),
        saveAddressBtn: document.getElementById("saveAddress"),
        streetInput: document.getElementById("street"),
        cityInput: document.getElementById("city"),
        postalInput: document.getElementById("postal")
    };

    if (!checkMissingElements(elements)) {
        return null;
    }

    return elements;
};

export const validateNavDom = () => {
    const elements = {
        logoutBtn: document.getElementById('logoutBtn')
    };

    return elements;
}

const checkMissingElements = (elements) => {
    const missing = [];
    for (const [name, el] of Object.entries(elements)) {
        if (!el) {
            missing.push(name);
        }
    }

    if (missing.length > 0) {
        console.error('Missing DOM elements:', missing);
        return false;
    }

    return true;
};

