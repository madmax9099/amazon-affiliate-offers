const productsPerPage = 30;
let currentPage = 1;
let products = [];
let filteredProducts = [];

const container = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("navbar");

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
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next Page";
  nextButton.style.margin = "20px auto";
  nextButton.style.display = "block";
  nextButton.style.padding = "10px 20px";
  nextButton.style.backgroundColor = "#ff9900";
  nextButton.style.color = "#fff";
  nextButton.style.border = "none";
  nextButton.style.borderRadius = "5px";
  nextButton.style.cursor = "pointer";

  nextButton.addEventListener("click", () => {
    if (currentPage * productsPerPage < filteredProducts.length) {
      currentPage++;
      updateDisplay();
      if (currentPage * productsPerPage >= filteredProducts.length) {
        nextButton.style.display = "none";
      }
    }
  });

  container.parentNode.insertBefore(nextButton, container.nextSibling);
  if (filteredProducts.length <= productsPerPage) {
    nextButton.style.display = "none";
  }
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

fetch('products.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    filteredProducts = products;
    displayProducts(paginateProducts());
    setupPagination();
  });

searchInput.addEventListener("input", () => {
  filterProducts();
});

hamburger.addEventListener("click", () => {
  navbar.classList.toggle("show");
});
