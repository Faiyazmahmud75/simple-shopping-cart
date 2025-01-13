// ========Fetching data ===========
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
// =========Cart functionalities==========
class Cart {
  constructor() {
    this.items = {};
    this.appliedPromo = null;
  }
  // add to cart
  addToCart(productId, productsData) { 
    const product = productsData.find(p => p.id === parseInt(productId)); 
    if (product) {
      if (productId in this.items) {
        if (this.items[productId].quantity < product.stock) { 
          this.items[productId].quantity++; 
        } else {
          alert(`Only ${product.stock} items of ${product.title} are available in stock.`);
        }
      } else {
        this.items[productId] = {
          product: product, 
          quantity: 1
        };
      }
    }
    updateCartUI();
  }
  // remove from cart
  removeFromCart(productId) {
    if (productId in this.items) {
      if (this.items[productId].quantity > 1) {
        this.items[productId].quantity--;
      } else {
        delete this.items[productId];
      }
    }
    updateCartUI();
    
  }
  // total price count
  getTotal(promoCode = null) {
    let total = 0;
    for (const productId in this.items) {
      total += this.items[productId].product.price * this.items[productId].quantity;
    }

    if (this.appliedPromo && promoCodes[this.appliedPromo]) {
      const discount = promoCodes[this.appliedPromo];
      total -= total * discount;
    }

    return total;
  }

  clearCart() {
    this.items = {};
    this.appliedPromo = null;
    updateCartUI();
    const promoCodeInput = document.getElementById('promo-code-input');
  promoCodeInput.value = '';
  }
}

const cart = new Cart();
let productsData;

const promoCodes = {
  ostad10: 0.1,
  ostad5: 0.05,
};

// =============displaying products dynamically=============

async function displayProducts() {
  productsData = await getProducts(); 
  const productContainer = document.getElementById('product-card');

  productsData.forEach(product => {
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
      cart.addToCart(product.id, productsData); 
    });
  });
}
// showing some extra data in a moodal

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
// same task as above but different button
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
// ============= Updating UI =============
function updateCartUI() {
  const cartItemCount = document.getElementById('cartItemCount');
  cartItemCount.textContent = Object.keys(cart.items).length;

  const cartItemsList = document.getElementById('cart-items-list');
  cartItemsList.innerHTML = ''; 

  for (const productId in cart.items) {
    const product = cart.items[productId].product;
    const quantity = cart.items[productId].quantity;

    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}" style="width: 50px; height: 50px; margin-right: 10px;">
      <p>${product.title}</p> 
      <span class="quantity-control">
        <button class="btn btn-sm btn-minus"><i class="fa-solid fa-minus"></i></button>
        <span class="quantity">${quantity}</span>
        <button class="btn btn-sm btn-plus"><i class="fa-solid fa-plus"></i></button>
      </span>
    `;

    const minusBtn = listItem.querySelector('.btn-minus');
    minusBtn.addEventListener('click', () => {
      cart.removeFromCart(productId);
    });

    const plusBtn = listItem.querySelector('.btn-plus');
    plusBtn.addEventListener('click', () => {
      cart.addToCart(productId, productsData);
    });

    cartItemsList.appendChild(listItem);
  }

  const cartTotal = document.getElementById('cart-total');
  cartTotal.textContent = `$${cart.getTotal(cart.appliedPromo).toFixed(2)}`;
  const appliedPromo = document.getElementById('applied-promo');
  if (cart.appliedPromo) {
    appliedPromo.innerHTML = `Promo <span">${cart.appliedPromo} </span> Applied Successfully!`; 
  } else {
    appliedPromo.innerHTML = '';
  }
}
// Checkout interface functionalities
const cartIcon = document.getElementById('cart-icon');
cartIcon.addEventListener('click', () => {
  const checkoutOffcanvas = new bootstrap.Offcanvas(document.getElementById('checkout-offcanvas'));
  checkoutOffcanvas.show();
});

const clearCartButton = document.getElementById('clear-cart-button'); 
clearCartButton.addEventListener('click', () => {
  cart.clearCart();
});


const checkoutButton = document.getElementById('checkout-button'); 
checkoutButton.addEventListener('click', () => {

  const cartSummaryModal = new bootstrap.Modal(document.getElementById('cart-summary-modal'));
  cartSummaryModal.show();

  const modalBody = document.getElementById('cart-summary-modal-body');
  modalBody.innerHTML = ''; 

  for (const productId in cart.items) {
    const product = cart.items[productId].product;
    const quantity = cart.items[productId].quantity;

    const itemSummary = document.createElement('p');
    itemSummary.textContent = `${product.title} x ${quantity} = $${(product.price * quantity).toFixed(2)}`;
    modalBody.appendChild(itemSummary);
  }
  const promomsge = document.getElementById('applied-promo');
  promomsge.textContent = '';
  const promoCodeInput = document.getElementById('promo-code-input');
  promoCodeInput.value = '';

  const modalTotal = document.getElementById('cart-summary-total');
  modalTotal.textContent = `Total: $${cart.getTotal().toFixed(2)}`;
});

// ++===+++===++ Promo Code functionality ++===+++===++

const promoCodeInput = document.getElementById('promo-code-input');
const applyPromoButton = document.getElementById('apply-promo-button');

applyPromoButton.addEventListener('click', () => {
  const enteredCode = promoCodeInput.value.toLowerCase(); 
  if (promoCodes[enteredCode]) {
    cart.appliedPromo = enteredCode; 
    updateCartUI(productsData); 
  } else {
    alert('Invalid promo code.');
  }
});


displayProducts();

