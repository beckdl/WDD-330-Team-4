import { setLocalStorage } from "./utils.mjs";
import { getLocalStorage } from "./utils.mjs";
import { findProductById } from "./productData.mjs";

function addProductToCart(product) {
  setLocalStorage("so-cart", product);
  const cart = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cart)) {
    setLocalStorage("so-cart", [cart]);
    return;
  }
  cart.push(product);
  setLocalStorage("so-cart", cart);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
