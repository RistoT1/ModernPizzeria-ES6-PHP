import { CartBackup } from '../components/index/cartBackup.js';
import { getApiPath } from './config.js';

export const fetchSizes = async () => {
    try {
        const res = await fetch(`${getApiPath()}?koko`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();

        const sizeMultipliers = {};
        if (result.success && Array.isArray(result.data)) {
            result.data.forEach(size => {
                sizeMultipliers[size.KokoID] = {
                    multiplier: parseFloat(size.HintaKerroin),
                    name: size.Nimi,
                    description: size.Kuvaus || ''
                };
            });
        }
        return sizeMultipliers;
    } catch (error) {
        console.error('Error fetching sizes:', error);
        return {};
    }
};

export const fetchPizza = async () => {
    try {
        const res = await fetch(`${getApiPath()}?pizzat`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        return result.success && Array.isArray(result.data) ? result.data : [];
    } catch (error) {
        console.error('Error fetching pizzas:', error);
        return [];
    }
};

export const fetchCartQuantity = async ({ includeItems = false } = {}) => {
    try {
        let guestToken = CartBackup.loadGuestToken();
        console.log(`local guestToken: ${guestToken || ''}`);

        const res = await fetch(`${getApiPath()}?kori&includeItems=${includeItems}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Guest-Token': guestToken || ''
            }
        });

        const result = await res.json();
        console.log('cart fetch', result);

        if (result.data && result.data.guestToken) {
            CartBackup.saveGuestToken(result.data.guestToken);
            guestToken = result.data.guestToken;
        }

        if (result.success && result.data) {
            const quantity = typeof result.data.totalQuantity === 'number' ? result.data.totalQuantity : 0;
            if (includeItems && Array.isArray(result.data.items)) {
                return { quantity, items: result.data.items };
            } else {
                return quantity;
            }
        } else {
            console.warn('Cart empty or not found from API.');
            return includeItems ? { quantity: 0, items: [] } : 0;
        }
    } catch (error) {
        console.error('Error fetching cart quantity:', error);
        return includeItems ? { quantity: 0, items: [] } : 0;
    }
};

export const deleteItemFromCart = async (item) => {
    try {
        const guestToken = CartBackup.loadGuestToken();
        const res = await fetch(`${getApiPath()}?kori&id=${item.cartRowID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Guest-Token': guestToken || ''
            }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        return result.success;
    } catch (error) {
        console.error('Error deleting cart item:', error);
        return false;
    }
};

export const updateCartItemQuantity = async (cartRowID, newQuantity) => {
    try {
        const guestToken = CartBackup.loadGuestToken();
        const res = await fetch(`${getApiPath()}?kori`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Guest-Token': guestToken || ''
            },
            body: JSON.stringify({
                cartRowID,
                quantity: newQuantity
            })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        return result.success;
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        return false;
    }
};
export const addItemToCart = async (item) => {
    try {
        const guestToken = CartBackup.loadGuestToken();

        const res = await fetch(`${getApiPath()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                , 'X-Guest-Token': guestToken || ''
            },
            body: JSON.stringify({
                addItem: true,
                PizzaID: item.PizzaID,
                KokoID: item.KokoID,
                Quantity: item.Quantity || 1
            })
        });

        console.log('adding product in api', item); // Debug
        const result = await res.json();
        console.log('add to cart response', result); // Debug
        if (result.data?.guestToken) {
            CartBackup.saveGuestToken(result.data.guestToken);
        }

        if (result.success) {
            return true;
        } else {
            console.warn('API error:', result.error || 'Unknown error');
            return false;
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        return false;
    }
};

