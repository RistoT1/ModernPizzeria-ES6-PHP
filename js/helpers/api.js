import { CartBackup } from '../components/index/cartBackup.js';
import { getPath } from './config.js';

export const apiRequest = async ({
    endpoint = '',
    method = 'GET',
    payload = null,
    includeItems = false,
    useGuestToken = false,
    credentials = null
} = {}) => {
    const url = `${getPath(true)}${endpoint}${includeItems ? `&includeItems=${includeItems}` : ''}`;
    const headers = { 'Content-Type': 'application/json' };

    if (useGuestToken) {
        const guestToken = CartBackup.loadGuestToken();
        headers['X-Guest-Token'] = guestToken || '';
    }

    const options = {
        method,
        headers,
        ...(payload && { body: JSON.stringify(payload) }),
        ...(credentials && { credentials })
    };

    try {
        const res = await fetch(url, options);
        let result;

        try {
            result = await res.json();
        } catch (jsonError) {
            console.error(`Failed to parse JSON response from ${url}:`, jsonError);
            throw new Error(`Invalid JSON raaaaaaaaaaaaaaaaaesponse. HTTP ${res.status}`);
        }
        console.log(`API response from ${method} ${endpoint}:`, result);
        if (!res.ok) {
            const errorMsg = result?.error || `HTTP ${res.status}`;
        }

        // Handle guest token updates
        if (result.data?.guestToken && useGuestToken) {
            CartBackup.saveGuestToken(result.data.guestToken);
        }

        return result;
    } catch (error) {
        console.error(`API error on ${method} ${endpoint}:`, error);
        return { success: false, error: error.message };
    }
};

export const fetchSizes = async () => {
    const response = await apiRequest({
        endpoint: '?koko',
        method: 'GET'
    });

    const sizeMultipliers = {};
    if (response.success && Array.isArray(response.data)) {
        response.data.forEach(size => {
            sizeMultipliers[size.KokoID] = {
                multiplier: parseFloat(size.HintaKerroin),
                name: size.Nimi,
                description: size.Kuvaus || ''
            };
        });
    }
    return sizeMultipliers;
};

export const fetchPizza = async () => {
    const response = await apiRequest({
        endpoint: '?pizzat',
        method: 'GET'
    });
    return response.success && Array.isArray(response.data) ? response.data : [];
};

export const fetchCartQuantity = async ({ includeItems = false } = {}) => {
    const response = await apiRequest({
        endpoint: `?kori`,
        method: 'GET',
        includeItems,
        useGuestToken: true
    });

    if (response.data?.guestToken) {
        CartBackup.saveGuestToken(response.data.guestToken);
    }

    if (response.success && response.data) {
        const quantity = typeof response.data.totalQuantity === 'number' ? response.data.totalQuantity : 0;
        if (includeItems && Array.isArray(response.data.items)) {
            return { quantity, items: response.data.items };
        } else {
            return quantity;
        }
    } else {
        return includeItems ? { quantity: 0, items: [] } : 0;
    }
};

export const deleteItemFromCart = async (item) => {
    const response = await apiRequest({
        method: 'DELETE',
        payload: {
            deleteItem: true,
            cartRowID: item.cartRowID
        },
        useGuestToken: true
    });
    return response.success;
};

export const updateCartItemQuantity = async (cartRowID, newQuantity) => {
    const response = await apiRequest({
        method: 'PUT',
        payload: {
            updateItemQuantity: true,
            cartRowID,
            quantity: newQuantity
        },
        useGuestToken: true
    });
    return response.success;
};

export const addItemToCart = async (requestData) => {
    const response = await apiRequest({
        method: 'POST',
        payload: requestData,
        useGuestToken: true
    });
    return response.success;
};

export const insertTilaus = async (requestData) => {
    const response = await apiRequest({
        method: 'POST',
        payload: requestData
    });
    return response;
};

export const fetchUser = async () => {
    const response = await apiRequest({
        endpoint: '?asiakas',
        method: 'GET',
        credentials: 'same-origin'
    });
    return response.success ? response : null;
};

export const signupUser = async (requestData) => {
    const response = await apiRequest({
        method: 'POST',
        payload: requestData
    });
    return response.success ? response : false;
};

export const loginUser = async (requestData) => {
    console.log('logiiiin' ,requestData);
    const response = await apiRequest({
        method: 'POST',
        payload: requestData
    });
    return response;
};

export const logoutUser = async () => {
    const response = await apiRequest({
        method: 'POST',
        payload: { logout: true }
    });
    return response.success;
};