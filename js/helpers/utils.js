export const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

const queue = [];
let activeCount = 0;
const maxVisible = 3;    // Max notifications shown at the same time
const MAX_QUEUE = 10;    // Max notifications in the queue

export function showNotification(msg, type = 'info') {
  // Prevent duplicate messages in the queue
  console.log('notification in que');
  if (queue.some(n => n.msg === msg && n.type === type)) return;

  // Prevent queue from growing too large
  if (queue.length >= MAX_QUEUE) return;

  queue.push({ msg, type });
  processQueue();
}

function processQueue() {
  if (activeCount >= maxVisible || queue.length === 0) return;

  const { msg, type } = queue.shift();
  const el = document.createElement('div');
  el.className = `notification notification-${type}`;
  el.textContent = msg;

  const container = document.querySelector('.notification-container');
  if (!container) return;

  container.appendChild(el);
  activeCount++;

  // Show notification for 3s, then hide + remove
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
    showNotification(`Tuotteiden kokonaismäärä ei voi ylittää: ${MAX_QUANTITY}. Soita Myymälään jos tilauksesi todella sisältää näin monta pizzaa <3`, 'error');
    setLoadingState(false);
    return true; // Indicate limit exceeded
  }

  return false; 
};


//signup and pass change
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const isEmailValid = (email) => 
    email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isPasswordStrong = (password) => passwordRegex.test(password);

export const doPasswordsMatch = (password, confirmPassword) => password === confirmPassword;

