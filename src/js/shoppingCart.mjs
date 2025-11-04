import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";


export function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
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
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

export function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty</p>";
    const total = calculateListTotal(cartItems);
    displayCartTotal(total);
    return;
  }
  const el = document.querySelector(".product-list")
  renderListWithTemplate(cartItemTemplate, el, cartItems);
  
  const total = calculateListTotal(cartItems);
  displayCartTotal(total);
}

function displayCartTotal(total) {
  if (total > 0) {
    // show our checkout button and total if there are items in the cart.
    document.querySelector(".list-footer").classList.remove("hide");
    document.querySelector(".list-total").innerText += ` $${total}`;
  } else {
    document.querySelector(".list-footer").classList.add("hide");
  }
}

function calculateListTotal(list) {
  if (!list || list.length === 0) {
    return 0;
  } else {
    const amounts = list.map((item) => {return item.FinalPrice});
    const total = amounts.reduce((sum, item) => sum + item, 0);
    return total;
  }
}