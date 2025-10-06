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

export const validateKassaDom = () => {
    const elements = {
        orderSummary: document.getElementById("orderSummary"),
        payButton: document.getElementById("payBtn"),
        csrfToken: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
    };
    if (!checkMissingElements(elements)) {
        return null;
    }
    return elements;
};

export const validatePopupDom = () => {
    const popup = document.getElementById('pizzaPopup');
    if (!popup) return null;

    const elements = {
        popup,
        popupHeader: popup.querySelector('.popup-header'),
        closeBtn: popup.querySelector('#closePopup'),
        sizeContainer: popup.querySelector('.size-options'),
        quantityDisplay: popup.querySelector('#quantity'),
        qtyContainer: popup.querySelector('.quantity-control'),
        popupTitle: popup.querySelector('.popup-title'),
        popupInfo: popup.querySelector('.popup-info'),
        popupIngredients: popup.querySelector('.popup-ingredients'),
        popupPrice: popup.querySelector('.popup-price'),
        popupInfoMain: popup.querySelector('.popup-info-main'),
        popupBody: popup.querySelector('.popup-body')
    };

    if (!checkMissingElements(elements)) {
        return null;
    }

    return elements;
};

export const validateSignUpDom = () => {
    const passwordToggleBtn = document.getElementById('passwordToggle');

    const elements = {
        form: document.getElementById('signupForm'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirm-password'),
        errorMessage: document.getElementById('error'),
        submitBtn: document.getElementById('submitBtn'),
        passwordToggleBtn: passwordToggleBtn,
        toggleIcon: passwordToggleBtn?.querySelector('i') || null, // fallback
        csrfToken: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            || document.querySelector('input[name="csrf_token"]')?.value
    };

    if (!checkMissingElements(elements)) {
        return null;
    }

    return elements;
};


export const validateLoginDom = () => {
    const passwordToggleBtn = document.getElementById('passwordToggle');
    const elements = {
        form: document.getElementById('loginForm'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        passwordToggleBtn: passwordToggleBtn,
        toggleIcon: passwordToggleBtn?.querySelector('i') || null,
        errorMessage: document.getElementById('error'),
        submitBtn: document.getElementById('submitBtn'),
        csrfToken: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            || document.querySelector('input[name="csrf_token"]')?.value
    }

    if (!checkMissingElements(elements)) {
        return null;
    }

    return elements;
}






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
        nav: document.getElementById('navbar'),
        logoutBtn: document.getElementById('logoutBtn'),
        mobileToggle: document.querySelector('.mobile-menu-toggle'),
        navLinks: document.querySelector('.nav-links')
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

