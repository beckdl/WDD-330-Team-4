// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlString = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlString.join(""));
}

export async function renderWithTemplate(
  templateFn,
  parentElement,
  data,
  callback,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlString = await templateFn(data);
  parentElement.insertAdjacentHTML(position, htmlString);
  if (callback) {
    callback(data);
  }
}

export function loadTemplate(path) {
  return async function () {
        const res = await fetch(path);
        if (res.ok) {
          const html = await res.text();
          return html;
        }
    };
}

export async function loadHeaderFooter() {
  const headerTemplateFn = loadTemplate("../partials/header.html");
  const headerEl = document.querySelector("#main-header");
  const footerTemplateFn = loadTemplate("../partials/footer.html");
  const footerEl = document.querySelector("#main-footer");
  await renderWithTemplate(headerTemplateFn, headerEl, null, () => updateCartCount(false));
  renderWithTemplate(footerTemplateFn, footerEl);
}

export function alertMessage(message, scroll = true, duration = 3000) {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert-message");
  alertEl.innerHTML = `<p>${message}</p><span>X</span>`;

  alertEl.addEventListener("click", function (e) {
    if (e.target.tagName === "SPAN") {
      main.removeChild(this);
    }
  })
  const main = document.querySelector("main");
  main.prepend(alertEl);

  if (scroll) 
    window.scrollTo(0, 0);
} 

export function customAlertMessage(scroll = true, duration = 3000) {
  const messageDoc = fetch('../json/alerts.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(alert => {
        createAlert(alert.message, alert.background, alert.color);
      });
    })
    .catch(error => console.error('Error fetching alert messages:', error));
  function createAlert(message, background, color) {

    const alertEl = document.createElement("div");
    alertEl.classList.add("alert-message");
    alertEl.innerHTML = `<p>${message}</p><span>X</span>`;
    alertEl.style.background = background;
    alertEl.style.color = color;

    alertEl.addEventListener("click", function (e) {
      if (e.target.tagName === "SPAN") {
        main.removeChild(this);
      }
    })
    const main = document.querySelector("main");
    main.prepend(alertEl);

    if (scroll) 
      window.scrollTo(0, 0);
  }
} 

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert-message");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}

export function updateCartCount(animate = false) {
  const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
  const countElement = document.querySelector("#cart-count");

  if (!countElement) return;

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (totalItems > 0) {
    countElement.textContent = totalItems;
    countElement.style.display = "inline-block";
  } else {
    countElement.style.display = "none";
  }

  // 🔥 Trigger animation
  if (animate) {
    countElement.classList.remove("cart-bump"); // reset if already animating
    void countElement.offsetWidth; // force reflow so animation restarts
    countElement.classList.add("cart-bump");
  }
}

export function showRegistrationPrompt() {
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (!hasVisited) {
        const modal = document.querySelector("#modal");
        modal.classList.remove("hide");
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Welcome!</h2>
                <p><a href="../register/index.html" class="register-btn">Register</a> today and get your very own Sleep Outside water bottle.</p>
                <button class="close-btn">&times;</button>
                
            </div>
        `;
        
        localStorage.setItem("hasVisited", "true");
        
        modal.querySelector(".close-btn").addEventListener("click", () => {
            modal.classList.add("hide");
        });
    }
}
