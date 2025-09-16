// kassa.js
(async () => {
    try {
        let customerData = JSON.parse(sessionStorage.getItem("customerData"));
        const orderSummary = document.getElementById("orderSummary");

        if (!customerData) {
            orderSummary.innerHTML = "<p>Ei asiakastietoja.</p>";
            return;
        }

        // Fetch customer info from server if logged in
        if (customerData.loggedIn) {
            const res = await fetch("../api/main.php?asiakas", {
                method: "GET",
                credentials: "same-origin"
            });
            const result = await res.json();
            console.log(result);

            if (result.success && result.data) {
                customerData = { ...customerData, ...result.data };
                console.log(customerData);
            } else {
                console.warn("Asiakastietojen haku epäonnistui, käytetään sessionDataa.");
            }
        }

        // Build order summary
        const cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];

        let html = `<h2>Asiakas</h2>
            <p>${customerData.Enimi} ${customerData.Snimi}</p>
            <p>${customerData.Email}, ${customerData.Puh}</p>
            <p>${customerData.Osoite}, ${customerData.PostiNum} ${customerData.PostiTp}</p>
            <h2>Tuotteet</h2><ul>`;

        cartItems.forEach(item => {
            html += `<li>${item.Nimi} (${item.sizeName}) × ${item.quantity} -  ${item.quantity === 1
                ? `Yksilöhinta ${item.unitPrice.toFixed(2)}€`
                : `Kokonaishinta ${item.totalPrice.toFixed(2)}€`}</li>`;
        });

        html += "</ul>";
        orderSummary.innerHTML = html;

        // Handle payment button
        document.getElementById("payBtn").addEventListener("click", async () => {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

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
            console.log(result);
            if (result.success === true) {
                alert("Tilaus vastaanotettu! Kiitos.");
                sessionStorage.removeItem("customerData");
                window.location.href = "../index.php";
            } else {
                alert("Virhe: " + result.error);
            }
        });

    } catch (err) {
        console.error("Virhe ladattaessa tilausdataa:", err);
        document.getElementById("orderSummary").innerHTML = "<p>Virhe ladattaessa tilausdataa.</p>";
    }
})();
