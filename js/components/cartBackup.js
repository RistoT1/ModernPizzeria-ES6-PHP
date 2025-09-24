export class CartBackup {
    static guestTokenKey = 'guestToken';
    static guestTokenExpiryKey = 'guestTokenExpiry';
    static GUEST_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000;

    static saveGuestToken(token) {
        if (!token) return;
        localStorage.setItem(this.guestTokenKey, token);
        const expiry = Date.now() + this.GUEST_TOKEN_LIFETIME;
        localStorage.setItem(this.guestTokenExpiryKey, expiry.toString());
    }

    static loadGuestToken() {
        const token = localStorage.getItem(this.guestTokenKey);
        const expiryStr = localStorage.getItem(this.guestTokenExpiryKey);
        const expiry = expiryStr ? parseInt(expiryStr, 10) : null;

        if (!token || !expiry || isNaN(expiry)) {
            this.clearGuestToken();
            return null;
        }

        if (Date.now() > expiry) {
            this.clearGuestToken();
            return null;
        }

        return token;
    }

    static clearGuestToken() {
        localStorage.removeItem(this.guestTokenKey);
        localStorage.removeItem(this.guestTokenExpiryKey);
    }
}