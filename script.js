let productsPerPage;
let currentPage = 1;
let products = [];
let filteredProducts = [];

const container = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("navbar");

function setProductsPerPage() {
  if (window.innerWidth <= 600) {
    productsPerPage = 50; // mobile
  } else {
    productsPerPage = 40; // desktop
  }
}

function displayProducts(productsToDisplay) {
  container.innerHTML = "";
  productsToDisplay.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="card-content">
        <h3>${product.title}</h3>
        <a href="${product.link}" target="_blank">Buy Now</a>
      </div>
    `;
    container.appendChild(card);
  });
}

function paginateProducts() {
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  return filteredProducts.slice(start, end);
}

function updateDisplay() {
  const paginatedProducts = paginateProducts();
  displayProducts(paginatedProducts);
}

function setupPagination() {
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous Page";
  prevButton.style.margin = "20px 10px";
  prevButton.style.display = "none";
  prevButton.style.padding = "10px 20px";
  prevButton.style.backgroundColor = "#ff9900";
  prevButton.style.color = "#fff";
  prevButton.style.border = "none";
  prevButton.style.borderRadius = "5px";
  prevButton.style.cursor = "pointer";

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next Page";
  nextButton.style.margin = "20px 10px";
  nextButton.style.display = "none";
  nextButton.style.padding = "10px 20px";
  nextButton.style.backgroundColor = "#ff9900";
  nextButton.style.color = "#fff";
  nextButton.style.border = "none";
  nextButton.style.borderRadius = "5px";
  nextButton.style.cursor = "pointer";

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updateDisplay();
      nextButton.style.display = "inline-block";
      if (currentPage === 1) {
        prevButton.style.display = "none";
      }
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage * productsPerPage < filteredProducts.length) {
      currentPage++;
      updateDisplay();
      prevButton.style.display = "inline-block";
      if (currentPage * productsPerPage >= filteredProducts.length) {
        nextButton.style.display = "none";
      }
    }
  });

  container.parentNode.insertBefore(prevButton, container.nextSibling);
  container.parentNode.insertBefore(nextButton, container.nextSibling);

  // Initial display logic for buttons
  if (filteredProducts.length > productsPerPage) {
    nextButton.style.display = "inline-block";
  } else {
    nextButton.style.display = "none";
  }
  prevButton.style.display = "none";

  return { prevButton, nextButton };
}

function filterProducts() {
  const query = searchInput.value.toLowerCase();
  filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(query)
  );
  currentPage = 1;
  updateDisplay();
  if (filteredProducts.length > productsPerPage) {
    nextButton.style.display = "block";
  } else {
    nextButton.style.display = "none";
  }
}

let nextButton;

fetch('products.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    filteredProducts = products;
    setProductsPerPage();
    updateDisplay();
    nextButton = setupPagination();
  });

searchInput.addEventListener("input", () => {
  filterProducts();
});

hamburger.addEventListener("click", () => {
  navbar.classList.toggle("show");
});

window.addEventListener("resize", () => {
  const oldProductsPerPage = productsPerPage;
  setProductsPerPage();
  if (oldProductsPerPage !== productsPerPage) {
    currentPage = 1;
    updateDisplay();
    if (filteredProducts.length > productsPerPage) {
      nextButton.style.display = "block";
    } else {
      nextButton.style.display = "none";
    }
  }
});
