async function getProducts() {
  try {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();

    if (data && Array.isArray(data.products)) {
      return data.products;
    } else {
      console.error('Invalid API response format.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

class Cart {
  constructor() {
    this.items = {};
  }

  addToCart(productId, quantity = 1) {
    if (productId in this.items) {
      this.items[productId] += quantity;
    } else {
      this.items[productId] = quantity;
    }
    updateCartUI();
  }

  removeFromCart(productId, quantity = 1) {
    if (productId in this.items) {
      if (this.items[productId] <= quantity) {
        delete this.items[productId];
      } else {
        this.items[productId] -= quantity;
      }
    }
    updateCartUI();
  }

  getTotal() {
    let total = 0;
    for (const productId in this.items) {
      const product = products.find(p => p.id === parseInt(productId));
      if (product) {
        total += product.price * this.items[productId];
      }
    }
    return total;
  }
}

const cart = new Cart();

async function displayProducts() {
  const products = await getProducts();
  const productContainer = document.getElementById('product-card');

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('col-md-6', 'col-lg-4', 'col-xl-3');
    productCard.innerHTML = `
      <div class="single-product">
        <div class="product-img">
          <img class="w-100" src="${product.thumbnail}" alt="${product.title}" />
        </div>
        <div class="product-details">
          <h2 class="text-center">${product.title}</h2>
          <p class="description">
            <ul>
              <li>Brand: ${product.brand}</li>
              <li>Category: ${product.category}</li>
              <li>Stock: ${product.stock}</li>
            </ul>
            <a href="#modal-details" class="modal-btn view-more-btn" data-bs-toggle="modal" data-bs-target="#modal-details">View More Info</a>
          </p>
        </div>
        <h3 class="text-center price">$${product.price}</h3>
        <div class="d-flex justify-content-evenly align-items-center">
          <button class="modal-btn get-details-btn" type="button" data-bs-toggle="modal" data-bs-target="#modal-details">Get Details</button>
          <button class="cart-btn">Add to Cart</button>
        </div>
      </div>
    `;
    productContainer.appendChild(productCard);

    setupDetailsModal(product, productCard);
    setupViewMoreModal(product, productCard);

    const addToCartButton = productCard.querySelector('.cart-btn');
    addToCartButton.addEventListener('click', () => {
      cart.addToCart(product.id);
    });
  });
}

function setupDetailsModal(product, productCard) {
  const getDetailsButton = productCard.querySelector('.get-details-btn');

  getDetailsButton.addEventListener('click', () => {
    const modalTitle = document.querySelector('.modal-short-description h1');
    modalTitle.textContent = product.title;

    const modalImage = document.querySelector('.modal-image img');
    modalImage.src = product.thumbnail;

    const keyFeaturesList = document.querySelector('.modal-short-description ul');
    keyFeaturesList.innerHTML = `
      <li>Model: ${product.brand} ${product.title}</li>
      <li>${product.description.split('.')[0]}</li> 
      <li>Category: ${product.category}</li> 
    `; 

    const modalPrice = document.querySelector('.modal-short-description h5');
    modalPrice.textContent = `Price: $${product.price}`;

    const modalDescription = document.querySelector('.modal-description p');
    modalDescription.textContent = product.description;
  });
}

function setupViewMoreModal(product, productCard) {
  const viewMoreButton = productCard.querySelector('.view-more-btn');

  viewMoreButton.addEventListener('click', () => {
    const modalTitle = document.querySelector('.modal-short-description h1');
    modalTitle.textContent = product.title;

    const modalImage = document.querySelector('.modal-image img');
    modalImage.src = product.thumbnail;

    const keyFeaturesList = document.querySelector('.modal-short-description ul');
    keyFeaturesList.innerHTML = `
      <li>Model: ${product.brand} ${product.title}</li>
      <li>${product.description.split('.')[0]}</li> 
      <li>Category: ${product.category}</li> 
    `; 

    const modalPrice = document.querySelector('.modal-short-description h5');
    modalPrice.textContent = `Price: $${product.price}`;

    const modalDescription = document.querySelector('.modal-description p');
    modalDescription.textContent = product.description;
  });
}

function updateCartUI() {
  const cartItemCount = document.getElementById('cartItemCount');
  cartItemCount.textContent = Object.keys(cart.items).length;

  const cartItemsList = document.getElementById('cart-items-list');
  cartItemsList.innerHTML = ''; 

  for (const productId in cart.items) {
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        ${product.title} (x${cart.items[productId]}) - $${product.price}
      `;
      cartItemsList.appendChild(listItem);
    }
  }

  const cartTotal = document.getElementById('cart-total');
  cartTotal.textContent = cart.getTotal().toFixed(2); 
}

displayProducts();

const cartIcon = document.getElementById('cart-icon');
cartIcon.addEventListener('click', () => {
  const checkoutOffcanvas = new bootstrap.Offcanvas(document.getElementById('checkout-offcanvas'));
  checkoutOffcanvas.show();
});

// ... (Checkout form submission handling can be added here)