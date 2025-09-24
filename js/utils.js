export const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

let notificationEl;

export const showNotification = (msg, type = 'info') => {
    if (!notificationEl) {
        notificationEl = document.createElement('div');
        notificationEl.className = 'notification';
        document.body.appendChild(notificationEl);
    }

    notificationEl.textContent = msg;
    notificationEl.className = `notification notification-${type}`;
    
    // Trigger animation
    setTimeout(() => notificationEl.classList.add('show'), 10);

    // Hide after 3 seconds
    setTimeout(() => {
        notificationEl.classList.remove('show');
    }, 3000);
};

export const updateCartCounter = (qty) => {
    const counter = document.querySelector('.cart-counter');
    if (!counter) return;
    const count = parseInt(qty) || 0;
    counter.textContent = count;
    counter.style.display = count > 0 ? 'inline-block' : 'none';
};