fetch('products.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("products");
    data.forEach(product => {
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
  });