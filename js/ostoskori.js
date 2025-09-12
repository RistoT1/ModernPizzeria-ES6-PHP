// --- DOM elements validation ---
const validateDOMElements = () => {
    const elements = {
        cartItemContainer: document.getElementById("cartItems"),
        cartEmptyContainer: document.getElementById("cartEmpty"),
        form: document.getElementById("info-form"),
        inputs: document.querySelectorAll("#info-form input[required]"),
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
        if (!element) {
            console.error(`Required DOM element not found: ${name}`);
            return false;
        }
    }
    return elements;
};

// --- DOM ---
let DOM = {};

// --- State ---
let savedAddress = null;

// --- Render cart items ---
const renderCartItems = (items) => {
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
        if (!result.success) throw new Error(result.message || "API palautti success: false");
        renderCartItems(result.data?.items || []);

    } catch (err) {
        console.error("Error fetching cart items:", err);
        DOM.cartItemContainer.innerHTML = `
            <div class="error-message">
                <p>Virhe ladattaessa ostoskoria.</p>
                <button onclick="location.reload()">Yritä uudelleen</button>
            </div>
        `;
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
    DOM.addressModal.style.display = "block";
    if (savedAddress) {
        DOM.streetInput.value = savedAddress.street;
        DOM.cityInput.value = savedAddress.city;
        DOM.postalInput.value = savedAddress.postal;
    }
};

const closeAddressModal = () => {
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
    DOM.addressInput.innerHTML = `
        <div class="saved-address">
            <strong>${street}</strong><br>
            ${postal} ${city}
        </div>
    `;

    DOM.openAddressBtn.style.display = "none";
    DOM.addressSection.style.display = "block";
    closeAddressModal();
};

// --- Form submit ---
const handleFormSubmit = (e) => {
    e.preventDefault();

    const customerData = {
        Enimi: document.getElementById("Enimi").value.trim(),
        Snimi: document.getElementById("Snimi").value.trim(),
        email: document.getElementById("email").value.trim(),
        puhelin: document.getElementById("puhelin").value.trim(),
        osoite: savedAddress ? savedAddress.street : "",
        kaupunki: savedAddress ? savedAddress.city : "",
        posti: savedAddress ? savedAddress.postal : "",
    };

    sessionStorage.setItem("customerData", JSON.stringify(customerData));
    window.location.href = "kassa.php";
};

// --- Notifications ---
const showNotification = (msg, type = "info") => {
    const n = document.createElement("div");
    n.className = `notification notification-${type}`;
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => {
        if (n.parentNode) n.parentNode.removeChild(n);
    }, 3000);
};

// --- Cart counter ---
const updateCartCounter = (qty) => {
    const counter = document.querySelector(".cart-counter");
    if (!counter) return;

    const count = parseInt(qty) || 0;
    counter.textContent = count;
    counter.style.display = count > 0 ? "inline-block" : "none";
};

// --- Event listeners ---
const setupEventListeners = () => {
    // Remove from cart
    DOM.cartItemContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".cart-item-remove");
        if (btn && confirm("Haluatko varmasti poistaa tämän tuotteen korista?")) {
            removeCartItem(btn.dataset.cartId);
        }
    });

    // Address modal
    DOM.openAddressBtn.addEventListener("click", openAddressModal);
    DOM.editAddressBtn.addEventListener("click", openAddressModal);
    DOM.closeModalBtn.addEventListener("click", closeAddressModal);
    DOM.saveAddressBtn.addEventListener("click", saveAddress);

    window.addEventListener("click", (e) => {
        if (e.target === DOM.addressModal) closeAddressModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && DOM.addressModal.style.display === "block") closeAddressModal();
    });

    // Input validation
    DOM.inputs.forEach((input) => {
        input.addEventListener("blur", function () {
            this.style.borderColor = this.value.trim() ? "#28a745" : "#dc3545";
        });
    });

    // Form submission
    DOM.form.addEventListener("submit", handleFormSubmit);
};

// --- Init ---
const initializePage = async () => {
    try {
        DOM = validateDOMElements();
        if (!DOM) throw new Error("Required DOM elements not found");

        setupEventListeners();
        await fetchCartItems();

        console.log("Cart page initialization complete");
    } catch (error) {
        console.error("Initialization failed:", error);
        showNotification("Sivun lataus epäonnistui", "error");
    }
};

// --- Start when DOM is ready ---
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePage);
} else {
    initializePage();
}
