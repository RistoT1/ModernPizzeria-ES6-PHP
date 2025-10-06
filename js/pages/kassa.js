import { validateKassaDom } from "../helpers/domValid.js";
import { fetchUser, insertTilaus } from "../helpers/api.js";
import { getPath } from "../helpers/config.js";

class KassaPage {
    #DOM;
    #customerData;
    #cartItems;

    constructor() {
        this.#DOM = validateKassaDom();
        if (!this.#DOM) throw new Error("Required DOM elements not found");

        const rawCustomerData = sessionStorage.getItem("customerData");
        if (!rawCustomerData) throw new Error("Customer data not found in session");

        this.#customerData = JSON.parse(rawCustomerData);
        this.#cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];

        this.#initialize();
    }

    async #initialize() {
        try {
            console.log("Customer data:", this.#customerData);

            if (this.#customerData.loggedIn) {
                await this.#fetchCustomerDetails();
            }

            console.log("Cart items:", this.#cartItems);

            this.#renderOrderSummary();
            this.#setupPaymentHandler();
        } catch (error) {
            console.error("Initialization error:", error);
            this.#DOM.orderSummary.innerHTML = "<p>Virhe ladattaessa tilausdataa.</p>";
        }
    }

    async #fetchCustomerDetails() {
         try {
            const userDetails = await fetchUser();
            if (userDetails.success) {
                this.#customerData = { ...this.#customerData, ...userDetails.data };
                console.log("Fetched user details:", userDetails.data);
            } else {
                console.warn("Failed to fetch user details:", userDetails.error);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    #renderOrderSummary() {
        const c = this.#customerData;
        const itemsHtml = this.#cartItems.map(item => {
            const name = item.Nimi || "Tuote";
            const size = item.sizeName || "";
            const qty = item.quantity || 1;
            const priceText = qty === 1
                ? `Yksilöhinta ${item.unitPrice?.toFixed(2) || "0.00"}€`
                : `Kokonaishinta ${item.totalPrice?.toFixed(2) || "0.00"}€`;

            return `<li>${name} (${size}) × ${qty} - ${priceText}</li>`;
        }).join("");

        this.#DOM.orderSummary.innerHTML = `
            <h2>Asiakas</h2>
            <p>${c.Enimi || ""} ${c.Snimi || ""}</p>
            <p>${c.Email || ""}, ${c.Puh || ""}</p>
            <p>${c.Osoite || ""}, ${c.PostiNum || ""} ${c.PostiTp || ""}</p>
            <h2>Tuotteet</h2>
            <ul>${itemsHtml}</ul>
        `;
    }

    #setupPaymentHandler() {
        this.#DOM.payButton?.addEventListener("click", async () => {
            try {
                const requestData = {
                    addTilaus: true,
                    ...this.#customerData,
                    csrf_token: this.#DOM.csrfToken
                };

                const response = await insertTilaus(requestData);
                if (response.success) {
                    console.log("Payment successful, order ID:", response.data.orderId);
                    alert("Maksu onnistui! Tilausvahvistus lähetetty sähköpostiin.");
                    window.location.href = `${getPath(false)}/index.php`;
                } else {
                    console.error("Payment failed:", response.error);
                    alert("Maksu epäonnistui: " + (response.error || "Tuntematon virhe"));
                }
            } catch (error) {
                console.error("Payment error:", error);
                alert("Virhe maksuprosessissa");
            }
        });
    }
}

// Wait for DOM readiness before initializing
const waitForDOM = () =>
    document.readyState === "loading"
        ? new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve))
        : Promise.resolve();

await waitForDOM();
new KassaPage();