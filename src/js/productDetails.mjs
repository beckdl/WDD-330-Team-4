import { findProductById } from "./externalServices.mjs";
import { setLocalStorage, getLocalStorage } from "./utils.mjs";

let product = {};

export default async function productDetails(productId) {
  // get the details for the current product. findProductById will return a promise! use await or .then() to process it
  product = await findProductById(productId);
  if (!product) {
    document.querySelector(".product-detail").classList.add("product-not-found");
    document.querySelector(".product-detail").innerHTML = "<h2>We're Sorry</h2>We could not find that product. Please go back to the <a href='../index.html'>home page</a> and try again.";
    
    return;
  }
  // once we have the product details we can render out the HTML
  renderProductDetails();
  // once the HTML is rendered we can add a listener to Add to Cart button
  document.getElementById("addToCart").addEventListener("click", addProductToCart.bind(null, product));
}

export async function addProductToCart(product) {
    const currentCart = getLocalStorage("so-cart");
    if (!currentCart || currentCart.length === 0) {
      setLocalStorage("so-cart", [product]);
      return;
    }
    currentCart.push(product);
    setLocalStorage("so-cart", currentCart);
}

function renderProductDetails() {
    document.querySelector("#productName").innerText = product.Brand.Name;
    document.querySelector("#productNameWithoutBrand").innerText =
      product.NameWithoutBrand;
    document.querySelector("#productImage").src = product.Images.PrimaryLarge;
    document.querySelector("#productImage").alt = product.Name;
    document.querySelector("#productFinalPrice").innerText = product.FinalPrice;
    document.querySelector("#productColorName").innerText =
      product.Colors[0].ColorName;
    document.querySelector("#productDescriptionHtmlSimple").innerHTML =
      product.DescriptionHtmlSimple;
    document.querySelector("#addToCart").dataset.id = product.Id;
}