// kassa.js
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get customer data from sessionStorage
        let customerData = JSON.parse(sessionStorage.getItem("customerData"));
        const orderSummary = document.getElementById("orderSummary");
        
        if (!orderSummary) {
            console.error("Order summary container not found");
            return;
        }

        if (!customerData) {
            orderSummary.innerHTML = "<p>Ei asiakastietoja.</p>";
            return;
        }

        console.log('Retrieved customerData:', customerData);

        // If logged in, fetch full customer info from server
        if (customerData.loggedIn) {
            try {
                const res = await fetch("../../api/main.php?asiakas", {
                    method: "GET",
                    credentials: "same-origin"
                });
                const result = await res.json();
                if (result.success && result.data) {
                    customerData = { ...customerData, ...result.data };
                } else {
                    console.warn("Failed to fetch customer info from server, using sessionData");
                }
            } catch (err) {
                console.warn("Error fetching customer info:", err);
            }
        }

        // Get cart items
        const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
        console.log('Retrieved cartItems:', cartItems);

        // Build order summary HTML
        let html = `
            <h2>Asiakas</h2>
            <p>${customerData.Enimi || ''} ${customerData.Snimi || ''}</p>
            <p>${customerData.Email || ''}, ${customerData.Puh || ''}</p>
            <p>${customerData.Osoite || ''}, ${customerData.PostiNum || ''} ${customerData.PostiTp || ''}</p>
            <h2>Tuotteet</h2>
            <ul>
        `;

        cartItems.forEach(item => {
            html += `<li>${item.Nimi || 'Tuote'} (${item.sizeName || ''}) × ${item.quantity || 1} - ${
                item.quantity === 1 ? `Yksilöhinta ${item.unitPrice?.toFixed(2) || '0.00'}€` :
                `Kokonaishinta ${item.totalPrice?.toFixed(2) || '0.00'}€`
            }</li>`;
        });

        html += "</ul>";
        orderSummary.innerHTML = html;

        // Handle payment button
        const payBtn = document.getElementById("payBtn");
        if (payBtn) {
            payBtn.addEventListener("click", async () => {
                try {
                    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

                    const payload = {
                        addTilaus: true,
                        ...customerData,
                        csrf_token: csrfToken
                    };

                    const response = await fetch("../api/main.php?addTilaus", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "same-origin",
                        body: JSON.stringify(payload)
                    });

                    const result = await response.json();
                    if (result.success === true) {
                        alert("Tilaus vastaanotettu! Kiitos.");
                        // Clear sessionStorage
                        sessionStorage.removeItem("customerData");
                        sessionStorage.removeItem("cartItems");
                        window.location.href = "../index.php";
                    } else {
                        alert("Virhe: " + result.error);
                    }
                } catch (err) {
                    console.error("Payment error:", err);
                    alert("Virhe maksuprosessissa");
                }
            });
        } else {
            console.warn("Pay button not found");
        }

    } catch (err) {
        console.error("Error loading order data:", err);
        const orderSummary = document.getElementById("orderSummary");
        if (orderSummary) orderSummary.innerHTML = "<p>Virhe ladattaessa tilausdataa.</p>";
    }
});
