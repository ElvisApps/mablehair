// Mable Hair Care - Global State, Config & Data

// --- Configuration ---
const storeConfig = {
    currency: "ZAR",
    currencySymbol: "R",
    deliveryFee: 50.00, // Editable delivery fee
    location: "North West, South Africa",
    phone: "072 772 3653",
    email: "info@mablehair.co.za",
    whatsappUrl: "https://wa.me/27727723653",
    
    // Banking Details for EFT
    bankingDetails: {
        bankName: "Capitec",
        accountHolder: "Mable Hair Care",
        accountNumber: "123456789",
        accountType: "Savings",
        branchCode: "20206"
    },

    // Google Apps Script Web App URL for Email Processing
    // Replace this with the actual deployed URL from Google Apps Script
    apiEndpoint: "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE" 
};

// --- Product Database ---
// To change prices: edit the 'price' field below. All pages update automatically.
const products = [
    {
        id: 'p1',
        name: 'Chebe Hair Food',
        category: 'Hair Food',
        price: 150,
        image: 'productImages/chebehairfood.webp',
        description: 'A nourishing hair-care treatment inspired by traditional African hair-care practices. Designed to help keep hair moisturised, conditioned and easier to manage.',
        benefits: [
            'Helps moisturise dry hair',
            'Helps improve hair manageability',
            'Helps keep hair feeling soft',
            'Suitable for regular hair-care routines',
            'Suitable for different hair types'
        ],
        ingredients: 'Shea Butter, Chebe Powder, Olive Oil, Castor Oil, Peppermint Essential Oil',
        instructions: 'Apply a suitable amount to the hair and scalp as part of your normal hair-care routine. Massage gently and style as desired.',
        rating: 4.8,
        reviews: 124
    },
    {
        id: 'p2',
        name: 'Chebe Powder',
        category: 'Hair Care',
        price: 120,
        image: 'productImages/chebepowder.webp',
        description: 'Traditional Chebe-inspired hair-care powder designed to be incorporated into a hair-care routine.',
        benefits: [
            'Helps support a moisturising hair routine',
            'Helps condition the hair',
            'Helps improve hair manageability',
            'Suitable for protective styling routines'
        ],
        ingredients: 'Chebe Powder',
        instructions: 'Mix the powder according to the product directions. Apply the paste into sectioned hair and twist it. Use the product as directed and avoid contact with the eyes.',
        rating: 4.9,
        reviews: 210
    },
    {
        id: 'p3',
        name: 'African Soap Shampoo',
        category: 'Shampoo',
        price: 130,
        image: 'productImages/africcan soap shampoo.webp',
        description: 'A cleansing hair-care product inspired by African traditional hair-care ingredients.',
        benefits: [
            'Cleanses the hair',
            'Helps remove buildup',
            'Leaves hair feeling fresh',
            'Suitable for regular hair-care routines'
        ],
        ingredients: 'Raw African Black Soap, Distilled Water, Aloe Vera, Tea Tree Oil, Vitamin E',
        instructions: 'Wet hair thoroughly. Apply a suitable amount of shampoo. Massage gently through the hair and scalp. Rinse thoroughly. Repeat if necessary. Avoid contact with eyes.',
        rating: 4.7,
        reviews: 89
    },
    {
        id: 'p4',
        name: 'Karkar Oil',
        category: 'Hair Oil',
        price: 140,
        image: 'productImages/Karkaroil.webp',
        description: 'A natural herbal hair oil designed to complement a regular hair-care routine.',
        benefits: [
            'Helps moisturise the hair',
            'Helps keep the scalp feeling nourished',
            'Helps reduce the feeling of dryness',
            'Helps improve hair manageability',
            'Suitable for regular hair-care routines'
        ],
        ingredients: 'Karkar Oil is made of 100% natural herbs.',
        instructions: 'Apply a small amount to the hair and scalp. Massage gently. For use with a Chebe paste routine: Apply the paste into sectioned hair and twist it. Use regularly as part of your preferred hair-care routine.',
        rating: 4.6,
        reviews: 56
    },
    {
        id: 'p5',
        name: 'Chebe Hair Growth Oil',
        category: 'Hair Oil',
        price: 160,
        image: 'productImages/chebehairgrowthoil.webp',
        description: 'A hair-care oil designed to support a healthy-looking hair-care routine.',
        benefits: [
            'Helps moisturise hair',
            'Helps keep hair soft',
            'Helps reduce dryness',
            'Helps improve manageability',
            'Suitable for regular hair-care routines'
        ],
        ingredients: 'Jojoba Oil, Argan Oil, Chebe Extract, Rosemary Essential Oil, Peppermint Oil',
        instructions: 'Apply a small amount to the hair and scalp. Massage gently. Use regularly as part of your normal hair-care routine.',
        rating: 4.8,
        reviews: 145
    },
    {
        id: 'p6',
        name: 'Chebe Hair Conditioner',
        category: 'Conditioner',
        price: 150,
        image: 'productImages/conditioner.jpeg',
        description: 'A conditioning product designed to leave hair feeling softer, smoother and easier to manage.',
        benefits: [
            'Helps condition the hair',
            'Helps improve softness',
            'Helps improve manageability',
            'Helps complement a regular washing routine'
        ],
        ingredients: 'Water, Cetearyl Alcohol, Shea Butter, Chebe Extract, Honey, Panthenol',
        instructions: 'Apply after shampooing. Distribute evenly through the hair. Leave according to the product directions. Rinse thoroughly.',
        rating: 4.9,
        reviews: 78
    }
];

// --- Global State ---
// Migrate old 'mable_cart' key to unified 'mableCart' key (one-time)
(function() {
    const old = localStorage.getItem('mable_cart');
    if (old && !localStorage.getItem('mableCart')) {
        localStorage.setItem('mableCart', old);
        localStorage.removeItem('mable_cart');
    }
})();

let cart = JSON.parse(localStorage.getItem('mableCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('mable_wishlist')) || [];

// --- Utility Functions ---

function saveCart() {
    localStorage.setItem('mableCart', JSON.stringify(cart));
    updateCartCounters();
}

function saveWishlist() {
    localStorage.setItem('mable_wishlist', JSON.stringify(wishlist));
    updateWishlistCounters();
}

function formatCurrency(amount) {
    return storeConfig.currencySymbol + amount.toFixed(2);
}

function generateOrderNumber() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(100 + Math.random() * 900);
    return `MHC-${dateStr}-${random}`;
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'check-circle';
    if(type === 'error') icon = 'exclamation-circle';
    if(type === 'info') icon = 'info-circle';

    toast.innerHTML = `<i class="fas fa-${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Cart Operations ---

function addToCart(event, productId, quantity = 1) {
    // Prevent default form submission or link navigation
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    quantity = parseInt(quantity);
    if (isNaN(quantity) || quantity <= 0) {
        showToast('Invalid quantity', 'error');
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => String(item.id) === String(productId));

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // Store consistent cart entry shape so every page can read it directly
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart();
    showToast(`Added to your cart`, 'success');
    
    // Animate cart icons instantly
    document.querySelectorAll('.cart-count').forEach(el => {
        el.classList.add('bump');
        setTimeout(() => el.classList.remove('bump'), 300);
    });
}

function updateCartCounters() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
        if(totalItems > 0) {
            el.style.display = 'flex';
        } else {
            el.style.display = 'none';
        }
    });
}

// --- Cart Rendering (Centralized for all pages) ---
function renderCart() {
    const container = document.getElementById('cartContainer');

    // If no cart container on this page, bail out
    if (!container) return;

    // Ensure cart is loaded from storage (in case other tabs changed it)
    cart = JSON.parse(localStorage.getItem('mableCart')) || [];

    if (cart.length === 0) {
        container.style.gridTemplateColumns = '1fr';
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <h2>Your cart is empty</h2>
                <p style="color: var(--text-light); margin: 1rem 0 2rem;">Explore our hair-care collection and find something for your routine.</p>
                <a href="shop.html" class="btn btn-primary">Shop Products</a>
            </div>
        `;
        updateCartCounters();
        return;
    }

    // Calculate subtotal from stored cart entry prices
    let subtotal = 0;
    cart.forEach(cartItem => {
        const price = Number(cartItem.price) || 0;
        subtotal += (price * cartItem.quantity);
    });
    const deliveryFee = Number(storeConfig.deliveryFee) || 0;
    const total = subtotal + deliveryFee;

    let html = `
        <div class="cart-items-wrapper">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="margin: 0">${cart.reduce((s,_)=>s+1,0)} Item${cart.length > 1 ? 's' : ''}</h3>
                <button type="button" onclick="clearCart()" style="background:none; border:none; color: var(--error-color); cursor:pointer; text-decoration:underline;">Clear Cart</button>
            </div>
    `;

    cart.forEach(cartItem => {
        const img = cartItem.image || '';
        const name = cartItem.name || 'Product';
        const price = Number(cartItem.price) || 0;

        html += `
            <div class="cart-item">
                <a href="product.html?id=${cartItem.id}">
                    <img src="${img}" alt="${name}" class="cart-item-img" loading="lazy">
                </a>
                <div class="cart-item-details">
                    <a href="product.html?id=${cartItem.id}"><h3>${name}</h3></a>
                    <div class="cart-item-price">${formatCurrency(price)}</div>
                    <div class="qty-controls">
                        <button type="button" class="qty-btn" onclick="updateQuantity('${cartItem.id}', -1)">
                            <i class="fas fa-minus" style="font-size: 0.7rem;"></i>
                        </button>
                        <span style="width: 30px; text-align: center;">${cartItem.quantity}</span>
                        <button type="button" class="qty-btn" onclick="updateQuantity('${cartItem.id}', 1)">
                            <i class="fas fa-plus" style="font-size: 0.7rem;"></i>
                        </button>
                    </div>
                </div>
                <button type="button" class="remove-btn" onclick="removeFromCart('${cartItem.id}')" aria-label="Remove ${name}">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
        `;
    });

    html += `
        </div>
        <div class="order-summary">
            <h3 style="margin-bottom: 1.5rem; font-size: 1.5rem;">Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal</span>
                <span>${formatCurrency(subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Estimated Delivery</span>
                <span>${formatCurrency(deliveryFee)}</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>${formatCurrency(total)}</span>
            </div>
            <button type="button" class="btn btn-primary" style="width: 100%; margin-top: 2rem; font-size: 1.1rem; padding: 1rem;" onclick="window.location.href='checkout.html'">
                Proceed to Checkout <i class="fas fa-lock"></i>
            </button>
            <a href="shop.html" class="btn btn-secondary" style="width: 100%; margin-top: 1rem; border: none; text-align:center; display:block;">
                Continue Shopping
            </a>
        </div>
    `;

    container.style.gridTemplateColumns = '';
    container.innerHTML = html;
    updateCartCounters();
}

function updateQuantity(productId, change) {
    const item = cart.find(i => String(i.id) === String(productId));
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            // If quantity drops to zero or below, remove the item
            cart = cart.filter(i => String(i.id) !== String(productId));
        }
        saveCart();
        renderCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(i => String(i.id) !== String(productId));
    saveCart();
    renderCart();
    showToast('Item removed from cart', 'info');
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        renderCart();
    }
}

// --- Wishlist Operations ---
function toggleWishlist(event, productId, btnElement) {
    if (event) event.preventDefault();
    
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        if(btnElement) {
            btnElement.classList.remove('active');
            btnElement.innerHTML = '<i class="far fa-heart"></i>';
        }
        showToast('Removed from wishlist', 'info');
    } else {
        wishlist.push(productId);
        if(btnElement) {
            btnElement.classList.add('active');
            btnElement.innerHTML = '<i class="fas fa-heart"></i>';
        }
        showToast('Added to wishlist');
    }
    saveWishlist();
}

function updateWishlistCounters() {
    // Optional: Add wishlist counter if needed
}

// --- UI Helpers ---

function createProductCard(product) {
    const isWishlisted = wishlist.includes(product.id);
    const starRating = Array(5).fill(0).map((_, i) => 
        `<i class="${i < Math.floor(product.rating) ? 'fas' : (i < product.rating ? 'fas fa-star-half-alt' : 'far')} fa-star" style="color: var(--accent-color); font-size: 0.8rem;"></i>`
    ).join('');

    return `
        <div class="product-card" data-id="${product.id}">
            <button type="button" class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(event, '${product.id}', this)">
                <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <a href="product.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            </a>
            <div class="product-category">${product.category}</div>
            <a href="product.html?id=${product.id}">
                <h3 class="product-title">${product.name}</h3>
            </a>
            <div style="margin-bottom: 0.5rem;">${starRating}</div>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <div class="product-actions">
                <button type="button" class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                <button type="button" class="btn btn-secondary" onclick="openQuickView(event, '${product.id}')">
                    <i class="far fa-eye"></i>
                </button>
            </div>
        </div>
    `;
}

// Quick View Logic
function openQuickView(event, productId) {
    if (event) event.preventDefault();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let modal = document.getElementById('quickViewModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quickViewModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <button type="button" class="modal-close" onclick="closeQuickView()"><i class="fas fa-times"></i></button>
                <div id="quickViewContent" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if(e.target === modal) closeQuickView();
        });
        
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape') closeQuickView();
        });
    }

    const content = document.getElementById('quickViewContent');
    const isMobile = window.innerWidth < 768;
    content.style.gridTemplateColumns = isMobile ? '1fr' : '1fr 1fr';
    
    content.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width:100%; border-radius: var(--border-radius); background: #f5f5f5;" loading="lazy">
        <div>
            <div class="product-category">${product.category}</div>
            <h2 style="font-size: 2rem; margin-bottom: 1rem;">${product.name}</h2>
            <div class="product-price" style="font-size: 1.5rem;">${formatCurrency(product.price)}</div>
            <p style="color: var(--text-light); margin-bottom: 1.5rem;">${product.description}</p>
            <div style="display:flex; gap: 1rem; margin-bottom: 1.5rem;">
                <input type="number" id="qv-quantity" value="1" min="1" max="10" style="width: 70px; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                <button type="button" class="btn btn-primary add-to-cart" data-id="${product.id}" style="flex:1;" onclick="addToCart(event, '${product.id}', parseInt(document.getElementById('qv-quantity').value)); closeQuickView();">Add to Cart</button>
            </div>
            <a href="product.html?id=${product.id}" style="text-decoration: underline; color: var(--text-main); font-weight: 500;">View Full Details</a>
        </div>
    `;

    void modal.offsetWidth;
    modal.classList.add('active');
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    updateCartCounters();
    updateWishlistCounters();

    const revealElements = document.querySelectorAll('.reveal');
    if(revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    }
});

// Delegate Add to Cart clicks for dynamically generated buttons
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;
    e.preventDefault();
    const productId = btn.dataset.id;
    // allow specifying data-quantity if needed, otherwise default to 1
    const qty = btn.dataset.quantity ? parseInt(btn.dataset.quantity, 10) : 1;
    if (!productId) return;
    addToCart(e, productId, qty);
});
