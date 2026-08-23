// Paste this into Firefox console on shop.html to diagnose the problem

console.log('=== MABLE HAIR CART DIAGNOSTIC ===\n');

// 1. Check if script.js loaded
console.log('1. Global functions loaded?');
console.log('   addToCart:', typeof window.addToCart);
console.log('   saveCart:', typeof window.saveCart);
console.log('   renderCart:', typeof window.renderCart);

// 2. Check current cart state
console.log('\n2. Current cart state:');
console.log('   window.cart:', window.cart);
console.log('   localStorage.getItem("mableCart"):', localStorage.getItem('mableCart'));

// 3. Check if Add to Cart buttons exist
console.log('\n3. Add to Cart buttons on page:');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
console.log('   Count:', addToCartButtons.length);
if (addToCartButtons.length > 0) {
    console.log('   First button:', addToCartButtons[0]);
    console.log('   First button data-id:', addToCartButtons[0].dataset.id);
}

// 4. Manually test adding a product
console.log('\n4. Testing addToCart() manually...');
console.log('   Before: cart =', window.cart);
window.addToCart(null, 'p1', 1);
console.log('   After: cart =', window.cart);
console.log('   localStorage mableCart:', localStorage.getItem('mableCart'));

// 5. Check cart counter elements
console.log('\n5. Cart counter elements:');
const cartCounters = document.querySelectorAll('.cart-count');
console.log('   Count:', cartCounters.length);
cartCounters.forEach((el, i) => {
    console.log(`   ${i}: textContent="${el.textContent}", display="${el.style.display}"`);
});

// 6. Test delegated event listener
console.log('\n6. Testing delegated click on Add to Cart button...');
if (addToCartButtons.length > 0) {
    console.log('   Click on first button...');
    addToCartButtons[0].click();
    console.log('   Cart after click:', window.cart);
    console.log('   localStorage mableCart:', localStorage.getItem('mableCart'));
}

console.log('\n=== END DIAGNOSTIC ===');
