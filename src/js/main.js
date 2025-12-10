import { alertMessage, loadHeaderFooter, showRegistrationPrompt } from "./utils.mjs";

loadHeaderFooter();

showRegistrationPrompt();

const newsLetterBtn = document.querySelector("#newsletter-button");
newsLetterBtn.addEventListener("click", (e) => {
  const email = document.querySelector("#email").value;
  if (!email) {
    return;
  }
  alertMessage("Thank you for subscribing to our newsletter!");
});