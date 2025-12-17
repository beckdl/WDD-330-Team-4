import { getProductsByCategory } from './externalServices.mjs';
import { renderListWithTemplate, formatCategoryLabel, setLocalStorage, LAST_CATEGORY_KEY } from "./utils.mjs";

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

      // Listen for sort changes
    const sortSelect = document.getElementById("sort-products");
    sortSelect.addEventListener("change", (e) => {
      const sortedProducts = sortProducts(products, e.target.value);
      renderListWithTemplate(productCardTemplate, el, sortedProducts);
    });

    const formattedCategory = formatCategoryLabel(category);
    document.querySelector(".title").textContent = formattedCategory;
    setLocalStorage(LAST_CATEGORY_KEY, { slug: category, label: formattedCategory });
    return {
      categoryLabel: formattedCategory,
      productCount: products.length
    };
}

function productDiscount (product) {
  if (product.SuggestedRetailPrice > product.FinalPrice) {
    const retailPrice = product.SuggestedRetailPrice;
    const finalPrice = product.FinalPrice;
    const discount = Math.round(((retailPrice - finalPrice) / retailPrice) * 100);
    return discount;
  }
}

function sortProducts(products, sortType) {
  const sorted = [...products];
  switch (sortType) {
    case "name-asc":
      return sorted.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
    case "name-desc":
      return sorted.sort((a, b) => b.NameWithoutBrand.localeCompare(a.NameWithoutBrand));
    case "price-asc":
      return sorted.sort((a, b) => a.FinalPrice - b.FinalPrice);
    case "price-desc":
      return sorted.sort((a, b) => b.FinalPrice - a.FinalPrice);
    default:
      return sorted;
  }
}
