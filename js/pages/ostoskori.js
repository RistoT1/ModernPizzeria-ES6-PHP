import { validateCartDom } from '../helpers/domValid.js';
import { fetchCartQuantity } from '../helpers/api.js';
import { Cart } from '../components/ostoskori/Cart.js';

// --- Initialize page ---
const initializePage = async () => {
    try {
        const DOM = validateCartDom();
        if (!DOM) throw new Error("Required DOM elements not found");

        DOM.cartEmptyContainer.style.display = "block";
        DOM.cartItemContainer.style.display = "none";

        const { items: cartItems } = await fetchCartQuantity({ includeItems: true });
        console.log("Fetched cart items:", cartItems);
        if (cartItems.length > 0) {
            new Cart({ container: DOM.cartItemContainer, items: cartItems });
            DOM.cartEmptyContainer.style.display = "none";
            DOM.cartItemContainer.style.display = "block";
        }
        window.addEventListener("cartItemChanged", async () => {
            const { items: updatedItems } = await fetchCartQuantity({ includeItems: true });
            if (updatedItems.length > 0) {
                new Cart({ container: DOM.cartItemContainer, items: updatedItems });
                DOM.cartEmptyContainer.style.display = "none";
                DOM.cartItemContainer.style.display = "block";
            } else {
                DOM.cartItemContainer.innerHTML = "";
                DOM.cartItemContainer.style.display = "none";
                DOM.cartEmptyContainer.style.display = "block";
            }
        });


    } catch (error) {
        console.error("Initialization failed:", error);
        alert("Sivun lataus epäonnistui");
    }
};
/* --- DOM Elements ---
const DOM = {
    cartItemContainer: document.getElementById("cartItemContainer"),
let savedAddress = null;

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
}; */


const waitForDOM = () => {
    return new Promise(resolve => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
};

waitForDOM().then(initializePage);