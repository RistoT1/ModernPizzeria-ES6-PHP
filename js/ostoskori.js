// --- DOM elements validation ---
const validateDOMElements = () => {
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
    };

    for (const [name, element] of Object.entries(elements)) {
        if (!element && !["formGuest","formLoggedIn"].includes(name)) {
            console.error(`Required DOM element not found: ${name}`);
            return false;
        }
    }

    return elements;
};

// --- State ---
let DOM = {};
let savedAddress = null;

// --- Render cart items ---
const renderCartItems = (items) => {
    if (!DOM.cartItemContainer) return;

    DOM.cartItemContainer.innerHTML = "";

    if (!items?.length) {
        DOM.cartEmptyContainer.style.display = "block";
        return;
    }

    DOM.cartEmptyContainer.style.display = "none";
    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.dataset.cartId = item.cartID;

        const imgSrc = item.Kuva ? `../src/img/${item.Kuva}` : "../src/img/default-pizza.jpg";
        const displayPrice = item.totalPrice || item.price || 0;

        cartItem.innerHTML = `
            <img class="cart-item-img" src="${imgSrc}" alt="${item.Nimi || "Pizza"}">
            <div class="cart-item-content">
                <h4 class="cart-item-title">${item.Nimi || "Pizza"}</h4>
                <p class="cart-item-quantity">Määrä: ${item.quantity}</p>
                <p class="cart-item-size">Koko: ${item.sizeName || "-"}</p>
                <p class="cart-item-price">€${displayPrice.toFixed(2)}</p>
            </div>
            <button class="cart-item-remove" data-cart-id="${item.cartID}">×</button>
        `;

        const imgElement = cartItem.querySelector(".cart-item-img");
        imgElement.onerror = () => {
            if (!imgElement.src.includes("default-pizza.jpg")) {
                imgElement.src = "../src/img/default-pizza.jpg";
            }
        };

        fragment.appendChild(cartItem);
    });

    DOM.cartItemContainer.appendChild(fragment);
};

// --- Fetch cart items ---
const fetchCartItems = async () => {
    try {
        const response = await fetch("../api/main.php?kori&includeItems=true");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        if (!result.success) throw new Error(result.message || "API returned success: false");
        renderCartItems(result.data?.items || []);
    } catch (err) {
        console.error("Error fetching cart items:", err);
        if (DOM.cartItemContainer) {
            DOM.cartItemContainer.innerHTML = `
                <div class="error-message">
                    <p>Virhe ladattaessa ostoskoria.</p>
                    <button onclick="location.reload()">Yritä uudelleen</button>
                </div>
            `;
        }
        DOM.cartEmptyContainer.style.display = "none";
    }
};

// --- Remove cart item ---
const removeCartItem = async (cartId) => {
    try {
        const response = await fetch("../api/removeFromCart.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartItemID: cartId }),
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to remove item");

        fetchCartItems();
    } catch (err) {
        console.error("Error removing item:", err);
        alert("Virhe poistettaessa tuotetta. Yritä uudelleen.");
    }
};

// --- Address modal ---
const openAddressModal = () => {
    if (!DOM.addressModal) return;
    DOM.addressModal.style.display = "block";

    if (savedAddress) {
        DOM.streetInput.value = savedAddress.street;
        DOM.cityInput.value = savedAddress.city;
        DOM.postalInput.value = savedAddress.postal;
    }
};

const closeAddressModal = () => {
    if (!DOM.addressModal) return;
    DOM.addressModal.style.display = "none";
};

const saveAddress = () => {
    const street = DOM.streetInput.value.trim();
    const city = DOM.cityInput.value.trim();
    const postal = DOM.postalInput.value.trim();

    if (!street || !city || !postal) {
        alert("Täytä kaikki osoitekentät");
        return;
    }

    savedAddress = { street, city, postal };
    if (DOM.addressInput) {
        DOM.addressInput.innerHTML = `
            <div class="saved-address">
                <strong>${street}</strong><br>
                ${postal} ${city}
            </div>
        `;
    }

    if (DOM.openAddressBtn) DOM.openAddressBtn.style.display = "none";
    if (DOM.addressSection) DOM.addressSection.style.display = "block";
    closeAddressModal();
};

// --- Form submit ---
const handleFormSubmit = (e) => {
    e.preventDefault();
    const isLoggedIn = document.getElementById("isLoggedIn")?.value === "1";
    let customerData = {};

    if (!isLoggedIn) {
        customerData = {
            Enimi: document.getElementById("Enimi")?.value.trim() || "",
            Snimi: document.getElementById("Snimi")?.value.trim() || "",
            Email: document.getElementById("email")?.value.trim() || "",
            Puh: document.getElementById("puhelin")?.value.trim() || "",
            Osoite: savedAddress?.street || "",
            PostiNum: savedAddress?.postal || "",  
            PostiTp: savedAddress?.city || "",     
        };
    } else {
        customerData = { loggedIn: true };
    }

    sessionStorage.setItem("customerData", JSON.stringify(customerData));
    window.location.href = "kassa.php";
};

// --- Setup event listeners ---
const setupEventListeners = () => {
    if (DOM.cartItemContainer) {
        DOM.cartItemContainer.addEventListener("click", (e) => {
            const btn = e.target.closest(".cart-item-remove");
            if (btn && confirm("Haluatko varmasti poistaa tämän tuotteen korista?")) {
                removeCartItem(btn.dataset.cartId);
            }
        });
    }

    if (DOM.openAddressBtn) DOM.openAddressBtn.addEventListener("click", openAddressModal);
    if (DOM.editAddressBtn) DOM.editAddressBtn.addEventListener("click", openAddressModal);
    if (DOM.closeModalBtn) DOM.closeModalBtn.addEventListener("click", closeAddressModal);
    if (DOM.saveAddressBtn) DOM.saveAddressBtn.addEventListener("click", saveAddress);

    window.addEventListener("click", (e) => {
        if (e.target === DOM.addressModal) closeAddressModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && DOM.addressModal?.style.display === "block") closeAddressModal();
    });

    // Guest form inputs validation
    if (DOM.formGuest) {
        const inputs = DOM.formGuest.querySelectorAll("input[required]");
        inputs.forEach((input) => {
            input.addEventListener("blur", () => {
                input.style.borderColor = input.value.trim() ? "#28a745" : "#dc3545";
            });
        });

        DOM.formGuest.addEventListener("submit", handleFormSubmit);
    }

    // Logged-in form
    if (DOM.formLoggedIn) {
        DOM.formLoggedIn.addEventListener("submit", handleFormSubmit);
    }
};

// --- Initialize page ---
const initializePage = async () => {
    try {
        DOM = validateDOMElements();
        if (!DOM) throw new Error("Required DOM elements not found");

        setupEventListeners();
        await fetchCartItems();

        console.log("Cart page initialized successfully");
    } catch (error) {
        console.error("Initialization failed:", error);
        alert("Sivun lataus epäonnistui");
    }
};

// --- Start ---
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePage);
} else {
    initializePage();
}
