export const validateMenuDom = () => {
    const elements = {
        mainContainer: document.getElementById("mainContainer"),
        menu: document.getElementById("menu"),
        popup: document.getElementById('Popup'),
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
export const validateIndexDom = () => {
    const elements = {
        heroSection: document.querySelector('.hero'),
        aboutSection: document.querySelector('.about'),
        menuSection: document.querySelector('.menu'),
        statsSection: document.querySelector('.stats'),
        menuButton: document.getElementById('menu_button'),
        locationSection: document.querySelector('.location')
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
    const root = document.querySelector('.popup'); 
    if (!root) return null;

    const required = {
        popup: root,
        popupHeader: root.querySelector('.popup-header'),
        closeBtn: root.querySelector('.close-btn'),
        popupTitle: root.querySelector('.popup-title'),
        popupBody: root.querySelector('.popup-body'),
        popupInfoMain: root.querySelector('.popup-info-main'),
    };

    const optional = {
        sizeContainer: root.querySelector('.size-options'),
        quantityDisplay: root.querySelector('#quantity'),
        qtyContainer: root.querySelector('.quantity-control'),
        popupInfo: root.querySelector('.popup-info'),
        popupIngredients: root.querySelector('.popup-ingredients'),
        popupPrice: root.querySelector('.popup-price'),
        historyContainer: root.querySelector('.order-history-container'),
    };

    const missingRequired = Object.entries(required).filter(([key, el]) => !el);
    if (missingRequired.length) {
        console.warn('Missing required popup elements:', missingRequired.map(([k]) => k));
        return null;
    }

    return { ...required, ...optional };
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
        postalInput: document.getElementById("postal"),
        historyBtn: document.getElementById("historyBtn")
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
        navLinks: document.querySelector('.nav-links'),
        orderBtn: document.querySelector('.order-btn')
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

