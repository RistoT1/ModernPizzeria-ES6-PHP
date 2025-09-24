import { CartBackup } from './components/cartBackup.js';

export const fetchSizes = async () => {
    try {
        const res = await fetch('./api/main.php?koko');
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
        const res = await fetch('./api/main.php?pizzat');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        return result.success && Array.isArray(result.data) ? result.data : [];
    } catch (error) {
        console.error('Error fetching pizzas:', error);
        return [];
    }
};

export const fetchCartQuantity = async () => {
    try {
        let guestToken = CartBackup.loadGuestToken();
        console.log(`local guestToken: ${guestToken || ''}`);

        const res = await fetch(`./api/main.php?kori&includeItems=false`, {
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

        if (result.success && result.data && typeof result.data.totalQuantity === 'number') {
            return result.data.totalQuantity;
        } else {
            console.warn('Cart empty or not found from API.');
            return 0;
        }
    } catch (error) {
        console.error('Error fetching cart quantity:', error);
        return 0;
    }
};