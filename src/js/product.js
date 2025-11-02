import { findProductById } from "./externalServices.mjs";
import { getParam } from "./utils.mjs";
import productDetails from "./productDetails.mjs";
import addProductToCart from "./productDetails.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const productId = getParam("product");
productDetails(productId);

// trigger cart animation
function triggerCartAnimation() {
  const cartIcon = document.querySelector(".cart");
  if (!cartIcon) return; // skip if header hasn't loaded yet
  cartIcon.classList.add("animate");
  cartIcon.addEventListener(
    "animationend",
    () => cartIcon.classList.remove("animate"),
    { once: true }
  );
}

// add to cart button event handler
//async function addToCartHandler(e) {
//  const product = await findProductById(e.target.dataset.id);
//  addProductToCart(product);
//}

// add listener to Add to Cart button
//document
//  .getElementById("addToCart")
//  .addEventListener("click", addToCartHandler);

loadHeaderFooter();
