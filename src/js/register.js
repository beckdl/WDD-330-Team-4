import { register } from "./externalServices.mjs";
import { getParam, loadHeaderFooter, setLocalStorage } from "./utils.mjs";

loadHeaderFooter();
const redirect = getParam("redirect") ?? "../index.html";

document.querySelector("#registerButton").addEventListener("click", (e) => {
  const name = document.querySelector("#name").value;
  const address = document.querySelector("#address").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const options = { name, address, email, password };
  register(options).then(() => {
    setLocalStorage("user-info", JSON.stringify(options));
    location.assign(redirect);
  });
});

