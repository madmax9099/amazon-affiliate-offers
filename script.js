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
    productsPerPage = 16; // desktop 4*4 grid
  }
}

function displayProducts(productsToDisplay) {
  container.innerHTML = "";
  productsToDisplay.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${index * 0.05}s`; // stagger animation
    card.innerHTML = `
      <div class="card-image">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="card-content">
        <h3>${product.title}</h3>
        <a href="${product.link}" target="_blank">Buy Now</a>
      </div>
    `;
    container.appendChild(card);
  });
}

// rest of the code remains unchanged
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
    applyResponsiveStyles();
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
  applyResponsiveStyles();
});

function applyResponsiveStyles() {
  if (window.innerWidth <= 600) {
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(2, 1fr)";
    container.style.gap = "15px";
    searchInput.style.width = "100%";
    searchInput.style.padding = "10px 15px";
    searchInput.style.fontSize = "1rem";
    searchInput.style.borderRadius = "8px";
    searchInput.style.border = "1px solid #999";
    searchInput.style.boxShadow = "0 0 5px rgba(0,0,0,0.1)";
    // Remove min-width from cards on mobile
    const cards = container.querySelectorAll('.card');
    cards.forEach(card => {
      card.style.minWidth = "";
    });
  } else {
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(6, 1fr)";
    container.style.gridTemplateRows = "repeat(6, auto)";
    container.style.gap = "30px";
    container.style.padding = "20px 60px";
    searchInput.style.width = "auto";
    searchInput.style.padding = "";
    searchInput.style.fontSize = "";
    searchInput.style.borderRadius = "";
    searchInput.style.border = "";
    searchInput.style.boxShadow = "";
    // Remove min-width for cards on desktop since grid controls layout
    const cards = container.querySelectorAll('.card');
    cards.forEach(card => {
      card.style.minWidth = "";
    });
  }
}
