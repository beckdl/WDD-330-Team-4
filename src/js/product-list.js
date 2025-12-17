import productList from "./productList.mjs";
import { loadHeaderFooter, updateBreadcrumb } from "./utils.mjs";
import { getParam } from "./utils.mjs";

const productId = getParam("category");

const productDataPromise = productList(".product-list", productId);
const headerPromise = loadHeaderFooter();

Promise.all([productDataPromise, headerPromise]).then(([breadcrumbData]) => {
  if (!breadcrumbData?.categoryLabel) return;
  const { categoryLabel, productCount } = breadcrumbData;
  const itemText = `${productCount} item${productCount === 1 ? "" : "s"}`;
  updateBreadcrumb(`${categoryLabel}->(${itemText})`);
});
