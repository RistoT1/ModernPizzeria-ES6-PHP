document.addEventListener("DOMContentLoaded", () => {
    const cartItemContainer = document.getElementById("cartItems");
    const cartEmptyContainer = document.getElementById("cartEmpty");
    const form = document.getElementById("info-form");
    const inputs = form.querySelectorAll("input[required]");

    const addressModal = document.getElementById("addressModal");
    const openAddressBtn = document.getElementById("openAddressModalBtn");
    const editAddressBtn = document.getElementById("editAddressBtn");
    const closeModalBtn = document.getElementById("closeModal");
    const addressSection = document.getElementById("addressSection");
    const addressInput = document.getElementById("addressInput");
    const saveAddressBtn = document.getElementById("saveAddress");
    const streetInput = document.getElementById("street");
    const cityInput = document.getElementById("city");
    const postalInput = document.getElementById("postal");

    let savedAddress = null;
    //renderöi ostoskorin
    const renderCartItems = (items) => {
        cartItemContainer.innerHTML = "";
        //jos ei saa pituutta ilmoittaa ostoskorin tyhjäksi
        if (!items?.length) {
            cartEmptyContainer.style.display = "block";
            return;
        }
        //piilottaa 
        cartEmptyContainer.style.display = "none";

        //luo fragmentin niinkuin indexissä.
        const fragment = document.createDocumentFragment();
        //käyläpi tuotteet
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
            //luo fallback imagen
            const imgElement = cartItem.querySelector(".cart-item-img");
            imgElement.onerror = () => {
                if (!imgElement.src.includes("default-pizza.jpg")) {
                    imgElement.src = "../src/img/default-pizza.jpg";
                }
            };

            fragment.appendChild(cartItem);
        });

        cartItemContainer.appendChild(fragment);
    };
    //
    const fetchCartItems = async () => {
        try {
            const response = await fetch("../api/fetchCart.php");
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const result = await response.json();
            if (!result.success) throw new Error(result.message || "API palautti success: false");

            renderCartItems(result.items || []);
        } catch (err) {
            console.error("Error fetching cart items:", err);
            cartItemContainer.innerHTML = `
                <div class="error-message">
                    <p>Virhe ladattaessa ostoskoria.</p>
                    <button onclick="location.reload()">Yritä uudelleen</button>
                </div>
            `;
            cartEmptyContainer.style.display = "none";
        }
    };

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

    cartItemContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".cart-item-remove");
        if (btn && confirm("Haluatko varmasti poistaa tämän tuotteen korista?")) {
            removeCartItem(btn.dataset.cartId);
        }
    });
    //lisää avatessa arvot jos on jo kerran asetettu
    const openAddressModal = () => {
        addressModal.style.display = "block";
        if (savedAddress) {
            streetInput.value = savedAddress.street;
            cityInput.value = savedAddress.city;
            postalInput.value = savedAddress.postal;
        }
    };

    const closeAddressModal = () => (addressModal.style.display = "none");

    const saveAddress = () => {
        const street = streetInput.value.trim();
        const city = cityInput.value.trim();
        const postal = postalInput.value.trim();

        if (!street || !city || !postal) {
            alert("Täytä kaikki osoitekentät");
            return;
        }

        savedAddress = { street, city, postal };
        addressInput.innerHTML = `
            <div class="saved-address">
                <strong>${street}</strong><br>
                ${postal} ${city}
            </div>
        `;

        openAddressBtn.style.display = "none";
        addressSection.style.display = "block";
        closeAddressModal();
    };

    openAddressBtn.addEventListener("click", openAddressModal);
    editAddressBtn.addEventListener("click", openAddressModal);
    closeModalBtn.addEventListener("click", closeAddressModal);
    saveAddressBtn.addEventListener("click", saveAddress);

    window.addEventListener("click", (e) => {
        if (e.target === addressModal) closeAddressModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && addressModal.style.display === "block") closeAddressModal();
    });

    inputs.forEach((input) => {
        input.addEventListener("blur", function () {
            this.style.borderColor = this.value.trim() ? "#28a745" : "#dc3545";
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // estää default käytännön

        // kerää tiedot
        const customerData = {
            Enimi: document.getElementById("Enimi").value.trim(),
            Snimi: document.getElementById("Snimi").value.trim(),
            email: document.getElementById("email").value.trim(),
            puhelin: document.getElementById("puhelin").value.trim(),
            osoite: savedAddress ? savedAddress.street : "",
            kaupunki: savedAddress ? savedAddress.city : "",
            posti: savedAddress ? savedAddress.postal : ""
        };

        // session storageen tiedot
        sessionStorage.setItem("customerData", JSON.stringify(customerData));

        // redirecti
        window.location.href = "kassa.php";
    });

    fetchCartItems();
});
