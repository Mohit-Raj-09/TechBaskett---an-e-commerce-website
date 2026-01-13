// --- cart.js ---
// This script should be included in All_products.html, my-cart.html, and buy-now.html


// Ensure productsData is available
if (!window.productsData) {
  window.productsData = [];
}

// Helper to get current user
theLoggedInUser = () => JSON.parse(localStorage.getItem("loggedInUser"));

// Initialize cart storage
// Update the initCart function in cart.js
function initCart() {
  if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify({}));
  }
  
  // Ensure it's always an object
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Save cart to current user
function saveCart(cart) {
  initCart();
  const loggedUser = theLoggedInUser();
  if (!loggedUser) {
    console.error("No user logged in");
    return;
  }

  try {
    let cartData = JSON.parse(localStorage.getItem("cart")) || {};
    cartData[loggedUser.email] = cart;
    localStorage.setItem("cart", JSON.stringify(cartData));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
}

// Load current user cart
function loadCart() {
  initCart();
  const loggedUser = theLoggedInUser();
  if (!loggedUser) return [];

  const cartData = JSON.parse(localStorage.getItem("cart")) || {};
  return cartData[loggedUser.email] || [];
}

// Add to cart handler
function addToCart(productId) {
  const loggedUser = theLoggedInUser();
  if (!loggedUser) {
    alert("Please login to add items to cart");
    window.location.href = "user-account.html";
    return;
  }

  const product = window.productsData.find((p) => p.id === productId);
  if (!product) return;

  const cart = loadCart();
  const index = cart.findIndex((p) => p.id === productId);

  if (index > -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1,
    });
  }

  saveCart(cart);

  // Visual feedback
  const button = document.querySelector(
    `button[onclick="addToCart(${productId})"]`
  );
  if (button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="ri-check-line"></i> Added';
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.backgroundColor = "";
      button.style.color = "";
    }, 2000);
  }
}

// Remove item from cart
function removeFromCart(productId) {
  const cart = loadCart().filter((item) => item.id !== productId);
  saveCart(cart);
  if (location.pathname.includes("my-cart.html")) {
    renderCartPage();
  }
}

// Update item quantity in cart
function updateCartItemQuantity(productId, quantity) {
  const cart = loadCart();
  const index = cart.findIndex((item) => item.id === productId);

  if (index > -1) {
    if (quantity < 1) {
      removeFromCart(productId);
    } else {
      cart[index].quantity = quantity;
      saveCart(cart);
    }
  }

  if (location.pathname.includes("my-cart.html")) {
    renderCartPage();
  }
}

// Render cart in my-cart.html
function renderCartPage() {
  const container = document.getElementById("cartContent");
  if (!container) return;

  const cart = loadCart();

  if (!theLoggedInUser()) {
    container.innerHTML = `
      <div class="login-message">
        <p>Please login to view your cart</p>
        <a href="user-account.html" class="login-btn">Login</a>
      </div>`;
    return;
  }

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty</p>
        <a href="All_products.html" class="continue-shopping">Continue Shopping</a>
      </div>`;
    return;
  }

  let subtotal = 0;
  let itemsHtml = cart
    .map((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-category">${item.category}</div>
          <div class="cart-item-price">₹${item.price.toLocaleString(
            "en-IN"
          )}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus" onclick="updateCartItemQuantity(${
              item.id
            }, ${item.quantity - 1})">-</button>
            <input type="number" class="quantity-input" value="${
              item.quantity
            }" min="1" 
                   onchange="updateCartItemQuantity(${
                     item.id
                   }, parseInt(this.value))">
            <button class="quantity-btn plus" onclick="updateCartItemQuantity(${
              item.id
            }, ${item.quantity + 1})">+</button>
          </div>
          <div class="cart-item-total">₹${itemTotal.toLocaleString(
            "en-IN"
          )}</div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${item.id})">
          <i class="ri-delete-bin-line"></i>
        </button>
      </div>`;
    })
    .join("");

  const shipping = subtotal > 5000 ? 0 : 100;
  const total = subtotal + shipping;

  container.innerHTML = `
    <div class="cart-items">${itemsHtml}</div>
    <div class="cart-summary">
      <div class="summary-title">Order Summary</div>
      <div class="summary-row">
        <span>Subtotal (${cart.reduce(
          (sum, item) => sum + item.quantity,
          0
        )} items)</span>
        <span>₹${subtotal.toLocaleString("en-IN")}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span>${shipping === 0 ? "FREE" : "₹" + shipping}</span>
      </div>
      <div class="summary-row">
        <span class="summary-total">Total</span>
        <span class="summary-total">₹${total.toLocaleString("en-IN")}</span>
      </div>
      <button class="checkout-btn" onclick="window.location.href='buy-now.html'">
        Proceed to Checkout
      </button>
    </div>`;
}

// Render checkout page in buy-now.html
function renderCheckoutPage() {
  const container = document.getElementById("checkoutContent");
  if (!container) return;

  const cart = loadCart();

  if (!theLoggedInUser()) {
    container.innerHTML = `
      <div class="login-message">
        <p>Please login to proceed with your order</p>
        <a href="user-account.html" class="login-btn">Login</a>
      </div>`;
    return;
  }

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 100px 0;">
        <h2>Your cart is empty</h2>
        <p>Please add some products to proceed with checkout</p>
        <a href="All_products.html" class="btn">Continue Shopping</a>
      </div>`;
    return;
  }

  let subtotal = 0;
  let itemsHtml = cart
    .map((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      return `
      <div class="order-item">
        <div class="order-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="order-item-details">
          <div class="order-item-title">${item.name}</div>
          <div class="order-item-price">₹${item.price.toLocaleString(
            "en-IN"
          )} × ${item.quantity}</div>
        </div>
      </div>`;
    })
    .join("");

  const shipping = subtotal > 5000 ? 0 : 100;
  const total = subtotal + shipping;

  container.innerHTML = `
    <div class="checkout-form">
      <div class="form-section">
        <h3 class="section-title">Shipping Information</h3>
        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input type="text" id="fullName" required>
        </div>
        <div class="form-group">
          <label for="address">Shipping Address</label>
          <textarea id="address" rows="4" required></textarea>
        </div>
        <div class="form-group">
          <label for="city">City</label>
          <input type="text" id="city" required>
        </div>
        <div class="form-group">
          <label for="state">State</label>
          <input type="text" id="state" required>
        </div>
        <div class="form-group">
          <label for="zip">ZIP Code</label>
          <input type="text" id="zip" required>
        </div>
      </div>
      
      <div class="form-section">
        <h3 class="section-title">Payment Method</h3>
        <div class="form-group">
          <label><input type="radio" name="payment" value="credit" checked> Credit/Debit Card</label>
        </div>
        <div class="form-group">
          <label><input type="radio" name="payment" value="upi"> UPI</label>
        </div>
        <div class="form-group">
          <label><input type="radio" name="payment" value="cod"> Cash on Delivery</label>
        </div>
      </div>
    </div>
    
    <div class="order-summary">
      <h3 class="section-title">Order Summary</div>
      ${itemsHtml}
      <div class="summary-row">
        <span>Subtotal</span>
        <span>₹${subtotal.toLocaleString("en-IN")}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span>${shipping === 0 ? "FREE" : "₹" + shipping}</span>
      </div>
      <div class="summary-row">
        <span class="summary-total">Total</span>
        <span class="summary-total">₹${total.toLocaleString("en-IN")}</span>
      </div>
      <button class="place-order-btn" onclick="placeOrder()">Place Order</button>
    </div>`;
}

// Place order function
function placeOrder() {
  const loggedUser = theLoggedInUser();
  if (!loggedUser) return;

  // Validate form
  const fullName = document.getElementById("fullName")?.value;
  const address = document.getElementById("address")?.value;
  const city = document.getElementById("city")?.value;
  const state = document.getElementById("state")?.value;
  const zip = document.getElementById("zip")?.value;

  if (!fullName || !address || !city || !state || !zip) {
    alert("Please fill in all shipping information");
    return;
  }

  const cart = loadCart();
  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  const paymentMethod =
    document.querySelector('input[name="payment"]:checked')?.value || "credit";
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 5000 ? 0 : 100;
  const total = subtotal + shipping;

  // Create order
  const order = {
    id: Date.now(),
    date: new Date().toISOString(),
    items: [...cart],
    shippingInfo: {
      name: fullName,
      address,
      city,
      state,
      zip,
    },
    paymentMethod,
    subtotal,
    shipping,
    total,
    status: "Processing",
  };

  // Save order
  let orders = JSON.parse(localStorage.getItem("orders")) || {};
  orders[loggedUser.email] = orders[loggedUser.email] || [];
  orders[loggedUser.email].push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Clear cart
  saveCart([]);

  // Redirect to confirmation
  window.location.href = `order-confirm.html?orderId=${order.id}`;
}

// Auto-load based on page
window.addEventListener("DOMContentLoaded", () => {
  initCart();
  const path = window.location.pathname;

  if (path.includes("my-cart.html")) {
    renderCartPage();
  } else if (path.includes("buy-now.html")) {
    renderCheckoutPage();
  }
});

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.placeOrder = placeOrder;
