export const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

const queue = [];
let activeCount = 0;
const maxVisible = 5;

export function showNotification(msg, type = 'info') {
  queue.push({ msg, type });
  processQueue();
}

function processQueue() {
  if (activeCount >= maxVisible || queue.length === 0) return;

  const { msg, type } = queue.shift();
  const el = document.createElement('div');
  el.className = `notification notification-${type}`;
  el.textContent = msg;

  document.querySelector('.notification-container').appendChild(el);
  activeCount++;

  setTimeout(() => {
    el.classList.add('hide');
    setTimeout(() => {
      el.remove();
      activeCount--;
      processQueue(); // Show next in queue
    }, 400);
  }, 3000);
}

export const updateCartCounter = qty => {
  const counter = document.querySelector('.cart-counter');
  if (!counter) return;

  const count = Number.parseInt(qty, 10) || 0;
  counter.textContent = count;
  counter.style.display = count > 0 ? 'inline-block' : 'none';
};

export const buildCartItem = (pizzaID, getSizeID, getQuantity) => {
  return {
    PizzaID: pizzaID,
    KokoID: getSizeID(),
    Quantity: getQuantity()
  };
}

export const checkQuantityLimit = async (getQuantity, fetchCartQuantity, showNotification, setLoadingState) => {
  const quantityToAdd = getQuantity();
  const MAX_QUANTITY = 99;

  const cartQty = await fetchCartQuantity();
  const newTotalQty = cartQty + quantityToAdd;

  if (newTotalQty > MAX_QUANTITY) {
    showNotification(`Et voi lisätä yli ${MAX_QUANTITY} kappaletta koriin.`, 'error');
    setLoadingState(false);
    return true; // Indicate limit exceeded
  }

  return false; 
};

