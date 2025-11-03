import { getProductsByCategory } from './externalServices.mjs';
import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
    <p class="product-card__discount ${
      productDiscount(product) ? "" : "hide"
    }">${productDiscount(product) ? `-${productDiscount(product)}%` : ""}</p>
    <img
      src="${product.Images.PrimaryMedium}"
      alt="Image of ${product.Name}"
    />
    <h3 class="card__brand">${product.Brand.Name}</h3>
    <h2 class="card__name">${product.NameWithoutBrand}</h2>
    <p class="product-card__price">$${product.FinalPrice}</p></a>
  </li>`;
}

export default async function productList(selector, category){
    // get the element we will insert the list into from the selector
    const el = document.querySelector(selector);
    // get the list of products 
    const products = await getProductsByCategory(category);
    console.log(products);
    //render out the product list to the element 
    renderListWithTemplate(productCardTemplate, el, products);
    document.querySelector(".title").innerHTML = category
      .replaceAll("-", " ")
      .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
}

function productDiscount (product) {
  if (product.SuggestedRetailPrice > product.FinalPrice) {
    const retailPrice = product.SuggestedRetailPrice;
    const finalPrice = product.FinalPrice;
    const discount = Math.round(((retailPrice - finalPrice) / retailPrice) * 100);
    return discount;
  }
}


  