import productList from "./productList.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import { getParam } from "./utils.mjs";

const productId = getParam("category");

productList(".product-list", productId);
loadHeaderFooter();