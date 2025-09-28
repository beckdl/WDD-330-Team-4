import { setLocalStorage } from "./utils.mjs";
import { getLocalStorage } from "./utils.mjs";
import { findProductById } from "./productData.mjs";

function addProductToCart(product) {
  const currentCart = getLocalStorage("so-cart") || [];
  if (!Array.isArray(currentCart)) {
    setLocalStorage("so-cart", [product]);
    return;
  }
  currentCart.push(product);
  setLocalStorage("so-cart", currentCart);
}
// Add to cart button handler
async function addToCartHandler(e) {
  const product = await findProductById(e.target.dataset.id);
  addProductToCart(product);
}
// Add to cart button listener
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
