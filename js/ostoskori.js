const cartItemContainer = document.getElementById("cartItems");
const cartEmptyContainer = document.getElementById("cartEmpty");

const renderCartItems = (items) => {
    // Always clear the container first
    cartItemContainer.innerHTML = '';

    if (!items || items.length === 0) {
        cartEmptyContainer.style.display = "block";
        return;
    } else {
        cartEmptyContainer.style.display = "none";
    }

    const fragment = document.createDocumentFragment();

    items.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = "cart-item";
        cartItem.dataset.cartId = item.cartID;

        let imgSrc = '../src/img/default-pizza.jpg'; // Default fallback
        if (item.Kuva) {
            imgSrc = `../src/img/${item.Kuva}`;
        }

        // Use totalPrice if available, otherwise fall back to price
        const displayPrice = item.totalPrice || item.price || 0;

        cartItem.innerHTML = `
            <img class="cart-item-img" src="${imgSrc}" alt="${item.Nimi || 'Pizza'}">
            <div class="cart-item-content">
                <h4 class="cart-item-title">${item.Nimi || 'Pizza'}</h4>
                <p class="cart-item-quantity">Määrä: ${item.quantity}</p>
                <p class="cart-item-size">Koko: ${item.sizeName || '-'}</p>
                <p class="cart-item-price">€${displayPrice.toFixed(2)}</p>
            </div>
            <button class="cart-item-remove" data-cart-id="${item.cartID}">×</button>
        `;

        const imgElement = cartItem.querySelector('.cart-item-img');
        imgElement.onerror = () => {
            console.log('Image failed to load:', imgSrc);
            // Only replace src if it's not already the fallback
            if (imgElement.src.indexOf('default-pizza.jpg') === -1) {
                imgElement.src = 'src/img/default-pizza.jpg';
            }
        };

        fragment.appendChild(cartItem);
    });

    cartItemContainer.appendChild(fragment);

    console.log(`Rendered ${items.length} cart items`);
};

// Function to fetch cart items
const fetchCartItems = async () => {
    try {
        console.log('Fetching cart items...');

        const response = await fetch('../api/fetchCart.php');

        if (!response.ok) {
            console.error('HTTP Error:', response.status, response.statusText);
            const errorData = await response.json().catch(() => ({}));
            console.error('Error response:', errorData);
            throw new Error(`HTTP ${response.status}: ${errorData.message || 'Network error'}`);
        }

        const result = await response.json();
        console.log('Full API response:', result);

        if (!result.success) {
            throw new Error(result.message || 'API returned success: false');
        }

        const items = result.items || [];
        console.log('Cart items:', items);
        console.log('Number of items:', items.length);

        // Log each item for debugging
        items.forEach((item, index) => {
            console.log(`Item ${index + 1}:`, {
                name: item.Nimi,
                quantity: item.quantity,
                price: item.price,
                totalPrice: item.totalPrice,
                cartID: item.cartID
            });
        });

        renderCartItems(items);

    } catch (err) {
        console.error('Error fetching cart items:', err);

        // Show user-friendly error message
        cartItemContainer.innerHTML = `
            <div class="error-message">
                <p>Virhe ladattaessa ostoskoria.</p>
                <p>Yritä päivittää sivu tai ota yhteyttä tukeen.</p>
                <button onclick="fetchCartItems()">Yritä uudelleen</button>
            </div>
        `;

        // Hide empty cart message when showing error
        cartEmptyContainer.style.display = "none";
    }
};

// Remove item function
const removeCartItem = async (cartId) => {
    try {
        console.log('Removing item with cart ID:', cartId);

        const response = await fetch('../api/removeFromCart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cartItemID: cartId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to remove item');
        }

        const result = await response.json();

        if (result.success) {
            console.log('Item removed successfully');
            // Refresh the cart display
            fetchCartItems();
        } else {
            throw new Error(result.message || 'Failed to remove item');
        }

    } catch (err) {
        console.error('Error removing item:', err);
        alert('Virhe poistettaessa tuotetta. Yritä uudelleen.');
    }
};

// Remove button event listener
cartItemContainer.addEventListener('click', e => {
    const btn = e.target.closest('.cart-item-remove');
    if (!btn) return;

    const cartId = btn.dataset.cartId;
    console.log('Remove button clicked, cart ID:', cartId);

    // Add confirmation
    if (confirm('Haluatko varmasti poistaa tämän tuotteen korista?')) {
        removeCartItem(cartId);
    }
});

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, fetching cart items...');
    fetchCartItems();
});

// Also fetch immediately in case DOMContentLoaded already fired
fetchCartItems();

// Address modal handling
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const addressModal = document.getElementById('addressModal');
    
    // Get buttons
    const openAddressBtn = document.getElementById('openAddressModalBtn');
    const editAddressBtn = document.getElementById('editAddressBtn');
    
    // Get close button
    const closeModalBtn = document.getElementById('closeModal');
    
    // Get form elements
    const addressSection = document.getElementById('addressSection');
    const addressInput = document.getElementById('addressInput');
    const saveAddressBtn = document.getElementById('saveAddress');
    
    // Get address inputs
    const streetInput = document.getElementById('street');
    const cityInput = document.getElementById('city');
    const postalInput = document.getElementById('postal');
    
    // Storage for address data
    let savedAddress = null;

    // Open Address Modal
    function openAddressModal() {
        addressModal.style.display = 'block';
        
        // If address exists, populate fields
        if (savedAddress) {
            streetInput.value = savedAddress.street;
            cityInput.value = savedAddress.city;
            postalInput.value = savedAddress.postal;
        }
    }

    // Close Address Modal
    function closeAddressModal() {
        addressModal.style.display = 'none';
    }

    // Save Address
    function saveAddress() {
        const street = streetInput.value.trim();
        const city = cityInput.value.trim();
        const postal = postalInput.value.trim();

        // Validate fields
        if (!street || !city || !postal) {
            alert('Täytä kaikki osoitekentät');
            return;
        }

        // Save address data
        savedAddress = { street, city, postal };
        
        // Update UI
        updateAddressDisplay();
        closeAddressModal();
    }

    // Update address display
    function updateAddressDisplay() {
        if (savedAddress) {
            // Hide the original button
            openAddressBtn.style.display = 'none';
            
            // Show address section
            addressSection.style.display = 'block';
            
            // Update address text
            addressInput.innerHTML = `
                <div class="saved-address">
                    <strong>${savedAddress.street}</strong><br>
                    ${savedAddress.postal} ${savedAddress.city}
                </div>
            `;
        }
    }

    // Event listeners
    openAddressBtn.addEventListener('click', openAddressModal);
    editAddressBtn.addEventListener('click', openAddressModal);
    closeModalBtn.addEventListener('click', closeAddressModal);
    saveAddressBtn.addEventListener('click', saveAddress);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === addressModal) {
            closeAddressModal();
        }
    });

    // Handle ESC key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (addressModal.style.display === 'block') {
                closeAddressModal();
            }
        }
    });

    // Add validation styling to form inputs
    const form = document.getElementById('info-form');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#28a745';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#28a745';
            }
        });
    });
});