import { alertMessage, loadHeaderFooter, showRegistrationPrompt } from "./utils.mjs";

loadHeaderFooter();

showRegistrationPrompt();

const newsLetterBtn = document.querySelector("#newsletter-button");

newsLetterBtn.addEventListener("click", e => {
  e.preventDefault();
  const email = document.querySelector("#email");
  if (!email.value) {
    return;
  }
  alertMessage("Thank you for subscribing to our newsletter!");
  email.value = "";
});