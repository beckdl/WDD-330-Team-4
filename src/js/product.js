import { getParam } from "./utils.mjs";
import productDetails from "./productDetails.mjs";
import { loadHeaderFooter, getLocalStorage, LAST_CATEGORY_KEY, updateBreadcrumb } from "./utils.mjs";

const productId = getParam("product");
productDetails(productId);

// add to cart button event handler
//async function addToCartHandler(e) {
//  const product = await findProductById(e.target.dataset.id);
//  addProductToCart(product);
//}

// add listener to Add to Cart button
//document
//  .getElementById("addToCart")
//  .addEventListener("click", addToCartHandler);

loadHeaderFooter().then(() => {
  const lastCategory = getLocalStorage(LAST_CATEGORY_KEY);
  if (lastCategory?.label) {
    updateBreadcrumb(lastCategory.label);
  }
});
