import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";


export function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <button class="cart-remove" data-id="${item.Id}">X</button>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <button class="quantity-btn decrease" data-id="${item.Id}">–</button>
  <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
  <button class="quantity-btn increase" data-id="${item.Id}">+</button>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

export function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const el = document.querySelector(".product-list");

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    el.innerHTML = "<p>Your cart is empty</p>";
    displayCartTotal(0);
    return;
  }

  renderListWithTemplate(cartItemTemplate, el, cartItems);

  // Attach remove listeners
  const removeButtons = el.querySelectorAll(".cart-remove");
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      removeCartItem(id);
    });
  });

  // Increase quantity
  el.querySelectorAll(".quantity-btn.increase").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      updateCartItemQuantity(id, 1); // add 1
    });
  });

  // Decrease quantity
  el.querySelectorAll(".quantity-btn.decrease").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      updateCartItemQuantity(id, -1); // subtract 1
    });
  });

  const total = calculateListTotal(cartItems);
  displayCartTotal(total);
}


function displayCartTotal(total) {
  if (total > 0) {
    // show our checkout button and total if there are items in the cart.
    document.querySelector(".list-footer").classList.remove("hide");
    document.querySelector(".list-total").innerText = `Total: $${total}`;
  } else {
    document.querySelector(".list-footer").classList.add("hide");
  }
}

function calculateListTotal(list) {
  if (!list || list.length === 0) {
    return 0;
  } else {
    const amounts = list.map(item => (item.FinalPrice || 0) * (item.quantity || 1));
    return amounts.reduce((sum, price) => sum + price, 0);
  }
}

function removeCartItem(id) {
  let cartItems = getLocalStorage("so-cart") || [];
  cartItems = cartItems.filter(item => item.Id != id); // remove the clicked item
  localStorage.setItem("so-cart", JSON.stringify(cartItems)); // update storage
  renderCartContents(); // re-render cart
}

function updateCartItemQuantity(id, change) {
  let cartItems = getLocalStorage("so-cart") || [];
  const item = cartItems.find(item => item.Id === id);

  if (!item) return;

  item.quantity = (item.quantity || 1) + change;

  // Remove if quantity drops below 1
  if (item.quantity < 1) {
    cartItems = cartItems.filter(i => i.Id !== id);
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents(); // refresh UI
}
