import { findProductById } from "./externalServices.mjs";
import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";

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
    const existingItem = currentCart.find(item => item.Id === product.Id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
      setLocalStorage("so-cart", currentCart);
      return;
    }
    currentCart.push(product);
    setLocalStorage("so-cart", currentCart);
    //update the cart count icon, animate it
    updateCartCount(true);
}

function renderProductDetails() {
    document.querySelector("#productName").innerText = product.Brand.Name;
    document.querySelector("#productNameWithoutBrand").innerText =
      product.NameWithoutBrand;

    const mainImage = document.querySelector("#productImage");

    // show the first color by default
    let selectedColor = product.Colors[0];

    // use responsive primary image
    setResponsivePrimaryImage(
      mainImage,
      product,
      `${product.Name} - ${selectedColor.ColorName}`
    );

    document.querySelector("#productFinalPrice").innerText = `$${product.FinalPrice}`;
    document.querySelector("#productColorName").innerText = selectedColor.ColorName;
  
    // render color swatches
    const colorContainer = document.querySelector("#productColorOptions");
    colorContainer.innerHTML = ""; // clear existing
  
    product.Colors.forEach((color, index) => {
      const swatch = document.createElement("img");
      swatch.src = color.ColorChipImageSrc; // small swatch image
      swatch.alt = color.ColorName;
      swatch.className = "color-swatch" + (index === 0 ? " selected" : "");
      swatch.dataset.index = index;
  
      // click handler to select color
      swatch.addEventListener("click", () => {
        selectedColor = color;
        mainImage.src = color.ColorPreviewImageSrc;
        mainImage.removeAttribute("srcset");
        mainImage.removeAttribute("sizes");
        mainImage.alt = `${product.Name} - ${color.ColorName}`;
        document.querySelector("#productColorName").innerText = color.ColorName;
  
        // update selected class
        colorContainer.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("selected"));
        swatch.classList.add("selected");
      });
  
      colorContainer.appendChild(swatch);
    });
  
    document.querySelector("#productDescriptionHtmlSimple").innerHTML =
      product.DescriptionHtmlSimple;
    document.querySelector("#addToCart").dataset.id = product.Id;
    if (product.SuggestedRetailPrice > product.FinalPrice) {
      const retailPrice = product.SuggestedRetailPrice;
      const finalPrice = product.FinalPrice;
      const discount = Math.round(((retailPrice - finalPrice) / retailPrice) * 100);
      document.querySelector("#discount").classList.remove("hide");
      document.querySelector("#discount").innerText = `-${discount}%`;
      document.querySelector("#productFinalPrice").innerHTML = 
    `<span class="retailDiscount">($${retailPrice})</span> $${product.FinalPrice}`;
    }
}

function setResponsivePrimaryImage(img, product, altText) {
  const images = product.Images;

  img.src = images.PrimaryLarge; // fallback
  img.srcset = `
    ${images.PrimarySmall} 80w,
    ${images.PrimaryMedium} 160w,
    ${images.PrimaryLarge} 320w,
    ${images.PrimaryExtraLarge} 600w
  `;
  img.sizes = "(max-width: 600px) 90vw, 400px";
  img.alt = altText;
}
