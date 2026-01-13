# TechBaskett

TechBaskett is a small, front-end only e-commerce demo focused on tech products — phones, laptops, tablets, smart wearables, TVs, monitors, audio and gaming gear. It is built with only HTML, CSS and vanilla JavaScript and uses the browser's localStorage to persist user, cart and order data (no backend required).

## Quick start
1. Clone or download the repository.
2. Open TechBaskett/html-files/home.html in a modern browser.

## Key features
- Client-side user registration/login (stored in localStorage)
- Product listing and category pages
- Search / category filtering UI (implemented in JS)
- Add to cart, view cart, "Buy Now" and checkout flow (simulated)
- Orders are saved and visible in the account page
- Responsive layout and basic form validation

## Tech stack
- HTML5
- CSS3
- JavaScript (ES6+)
- localStorage for data persistence

## Project structure (important files)
TechBaskett/html-files/
- home.html — Landing / main store page
- All_products.html — All products listing
- buy-now.html — Buy now / checkout page
- my-cart.html — Cart page
- product_details.html — Product detail page
- user-account.html — Account & orders page
- order-confirm.html — Order confirmation
- about.html, blog.html, contact.html — informational pages
- Category pages: Smartphones.html, Laptops.html, Tablets.html, TV.html, Monitors.html, Smart_wearables.html, Gaming_products.html, Audio_products.html
- Images/ — product and UI images
- css-files/
  - home.css, All_products.css, buy-now.css, group-wise-product.css, nav-footer.css, user-account.css, ...
- js-files/
  - products.js — product data and rendering logic
  - category-products.js — category / filter logic
  - cart.js — cart and checkout logic

To update product data or categories, edit products.js (in js-files). Styling is in css-files.

## Data & storage
All persistent data (users, current session, cart contents, orders) is stored in the browser's localStorage. Inspect Developer Tools → Application → Local Storage to view or clear data. Because data is client-side only, it persists per browser/device and can be modified via devtools.

## Known limitations & security notes
- Front-end demo only — no server or database.
- localStorage is not secure: do not store sensitive data or real passwords here.
- Checkout and payments are simulated; no real payment processing.
- Not production-ready. For a production app use a backend, secure authentication, HTTPS and proper payment integration.

## Contributing
Small improvements welcome: bug fixes, UI/UX polishing, accessibility, or converting storage to a backend API. Open an issue or a pull request.

## Contact
Author: Mohit-Raj-09 — open an issue in this repository for questions or suggestions.
