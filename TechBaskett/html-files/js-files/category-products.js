// Function to load products based on category
function loadCategoryProducts() {
    // Get the category from the page title
    const pageTitle = document.querySelector('.left-container h1').textContent.trim();
    let category = '';
    
    // Map page titles to product categories
    const categoryMap = {
        'Smart Wearables': 'Smart Wearables',
        'Smartphones': 'Smartphones',
        'Tablets': 'Tablets',
        'Televisions': 'TVs',
        'Audio Section': 'Audio',
        'Gaming Gadgets': 'Gaming',
        'Laptops': 'Laptops',
        'Monitors': 'Monitors'
    };
    
    category = categoryMap[pageTitle] || '';
    
    if (!category) return;
    
    // Filter products by category
    const categoryProducts = window.productsData.filter(product => product.category === category);
    
    // Split into two layers (4 products in first layer, remaining in second)
    const layer1Products = categoryProducts.slice(0, 4);
    const layer2Products = categoryProducts.slice(4, 7); // Showing max 7 products total
    
    // Generate HTML for products
    // Update the generateProductHTML function in category-products.js
function generateProductHTML(product) {
    const badgeHTML = product.badge ? `<div id="trend"><h5>${product.badge}</h5></div>` : '';
    const priceFormatted = new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(product.price).replace('₹', '₹');
    
    return `
    <div class="products">
        <a href="product_details.html?id=${product.id}">
            <div id="up">
                <img src="${product.image}" height="200px" width="100%" alt="${product.name}">
                ${badgeHTML}
            </div>
            <div id="down">
                <p>${product.category}</p>
                <h3>${product.name}</h3>
                <div id="rate">
                    <span>${priceFormatted}</span>  
                    <button class="add_cart" data-id="${product.id}"><i class="ri-shopping-cart-line"></i> &nbsp; &nbsp; &nbsp;Add</button>
                </div>
            </div>
        </a>
    </div>
    `;
}

// Add event delegation for add to cart buttons
document.addEventListener('DOMContentLoaded', function() {
    loadCategoryProducts();
    
    // Handle add to cart button clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add_cart') || e.target.closest('.add_cart')) {
            e.preventDefault();
            const button = e.target.classList.contains('add_cart') ? e.target : e.target.closest('.add_cart');
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        }
    });
});

// Add this function to category-products.js
function addToCart(productId) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("Please login to add items to your cart");
        window.location.href = "user-account.html";
        return;
    }

    // Get the product details
    const product = window.productsData.find(p => p.id === productId);
    if (!product) return;

    // Get current cart
    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    const userCart = cart[loggedInUser.email] || [];

    // Check if product already in cart
    const existingItem = userCart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        userCart.push({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: 1
        });
    }

    // Save updated cart
    cart[loggedInUser.email] = userCart;
    localStorage.setItem("cart", JSON.stringify(cart));

    // Show success message
    alert(`${product.name} has been added to your cart`);
}
    
    // Get container elements
    const layer1 = document.getElementById('layer1');
    const layer2 = document.getElementById('layer2');
    
    // Clear existing content
    if (layer1) layer1.innerHTML = '';
    if (layer2) layer2.innerHTML = '';
    
    // Add products to layers
    layer1Products.forEach(product => {
        if (layer1) layer1.innerHTML += generateProductHTML(product);
    });
    
    layer2Products.forEach(product => {
        if (layer2) layer2.innerHTML += generateProductHTML(product);
    });
}

// Load products when DOM is ready
document.addEventListener('DOMContentLoaded', loadCategoryProducts);