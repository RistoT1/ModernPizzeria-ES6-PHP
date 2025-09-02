<!DOCTYPE html>
<html lang="fi">

<head>
    <meta charset="UTF-8">
    <title>Kassa - Sakky Pizzeria</title>
</head>

<body>
    <h1>Kassa</h1>
    <div id="orderSummary"></div>
    <button id="payBtn">Maksa nyt</button>

    <script>
        (async () => {
            try {
                const customerData = JSON.parse(sessionStorage.getItem("customerData"));
                const orderSummary = document.getElementById("orderSummary");

                if (!customerData) {
                    orderSummary.innerHTML = "<p>Ei asiakastietoja.</p>";
                    return;
                }

                // Fetch cart items from PHP
                const res = await fetch("../api/fetchCart.php");
                const data = await res.json();

                if (!data.success || !data.items || data.items.length === 0) {
                    orderSummary.innerHTML = "<p>Ostoskorisi on tyhjä.</p>";
                    return;
                }

                const cartItems = data.items;

                // Build order summary
                let html = `<h2>Asiakas</h2>
                    <p>${customerData.Enimi} ${customerData.Snimi}</p>
                    <p>${customerData.email}, ${customerData.puhelin}</p>
                    <p>${customerData.osoite}, ${customerData.posti} ${customerData.kaupunki}</p>
                    <h2>Tuotteet</h2><ul>`;

                cartItems.forEach(item => {
                    html += `<li>${item.Nimi} (${item.sizeName}) × ${item.quantity} — €${item.price.toFixed(2)}</li>`;
                });

                html += "</ul>";

                orderSummary.innerHTML = html;

                // Handle payment button
                document.getElementById("payBtn").addEventListener("click", async () => {
                    // Only send cart IDs, not full items


                    const response = await fetch("../api/insertTilaus.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "same-origin", 
                        body: JSON.stringify({ ...customerData })
                    });

                    const result = await response.json();
                    if (result.success) {
                        alert("Tilaus vastaanotettu! Kiitos.");
                        sessionStorage.removeItem("customerData");
                        window.location.href = "kiitos.html";
                    } else {
                        alert("Virhe: " + result.message);
                    }
                });

            } catch (err) {
                console.error("Virhe ladattaessa tilausdataa:", err);
                document.getElementById("orderSummary").innerHTML = "<p>Virhe ladattaessa tilausdataa.</p>";
            }
        })();
    </script>
</body>

</html>