const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('script.js','utf8');

function extractBlock(code, startPhrase) {
    const start = code.indexOf(startPhrase);
    if (start === -1) return null;
    let i = start;
    // find first '{' after startPhrase
    const braceStart = code.indexOf('{', start);
    if (braceStart === -1) return null;
    let depth = 0;
    let end = -1;
    for (i = braceStart; i < code.length; i++) {
        if (code[i] === '{') depth++;
        else if (code[i] === '}') {
            depth--;
            if (depth === 0) { end = i; break; }
        }
    }
    if (end === -1) return null;
    return code.slice(start, end+1);
}

// Extract products array (starts with const products = [)
const prodIndex = code.indexOf('const products = [');
if (prodIndex === -1) {
    console.error('Products array not found'); process.exit(1);
}
// find matching closing bracket for the array
function extractArray(code, startIndex) {
    let i = code.indexOf('[', startIndex);
    if (i === -1) return null;
    let depth = 0;
    for (; i < code.length; i++) {
        if (code[i] === '[') depth++;
        else if (code[i] === ']') {
            depth--;
            if (depth === 0) {
                // include until semicolon or newline
                let j = i+1;
                while (j < code.length && code[j] !== ';' && code[j] !== '\n') j++;
                return code.slice(startIndex, j+1);
            }
        }
    }
    return null;
}
const productsBlock = extractArray(code, prodIndex);
if (!productsBlock) { console.error('Failed extracting products'); process.exit(1); }

// Extract functions we need
const saveCartBlock = extractBlock(code, 'function saveCart(');
const addToCartBlock = extractBlock(code, 'function addToCart(');
const updateQuantityBlock = extractBlock(code, 'function updateQuantity(');
const removeFromCartBlock = extractBlock(code, 'function removeFromCart(');
const clearCartBlock = extractBlock(code, 'function clearCart(');
const renderCartBlock = extractBlock(code, 'function renderCart(');

if (!saveCartBlock || !addToCartBlock) { console.error('Failed to extract core functions'); process.exit(1); }

// Build a small script to run in VM and execute a full sequence of cart actions including rendering
const scriptToRun = `
const storeConfig = { currencySymbol: 'R', deliveryFee: 50 };
${productsBlock}
let cart = [];
${saveCartBlock}
${addToCartBlock}
${updateQuantityBlock || ''}
${removeFromCartBlock || ''}
${clearCartBlock || ''}
${renderCartBlock || ''}
// minimal mocks
function showToast(msg, type) { /* no-op */ }
function updateCartCounters() { /* no-op */ }
function formatCurrency(amount) { return 'R' + Number(amount).toFixed(2); }

// simple document mock: cartContainer and cart-count
const _mockContainer = { innerHTML: '', style: {}, set innerHTML(v) { this._html = v; }, get innerHTML() { return this._html; } };
function getElementById(id) {
    if (id === 'cartContainer') return _mockContainer;
    return null;
}
const document = { getElementById, querySelectorAll: () => [{ classList: { add(){}, remove(){} }, textContent: '0', style: { display: 'none' } }] };

// Test sequence:
// 1) Add p1 x1
addToCart(null, 'p1', 1);
// 2) Add p1 again x1 -> quantity should be 2
addToCart(null, 'p1', 1);
// 3) Add p2 x2
addToCart(null, 'p2', 2);
// 4) Increase p2 by 1 using updateQuantity if available
if (typeof updateQuantity === 'function') updateQuantity('p2', 1);
// 5) Decrease p1 by 1
if (typeof updateQuantity === 'function') updateQuantity('p1', -1);
// 6) Remove p2 using removeFromCart
if (typeof removeFromCart === 'function') removeFromCart('p2');
// 7) Render cart
if (typeof renderCart === 'function') renderCart();
// 8) Check container HTML and localStorage content
console.log('CONTAINER_HTML::', _mockContainer.innerHTML ? 'rendered' : 'empty');
console.log('CART_JSON::', JSON.stringify(cart));
// 9) Clear cart (skip confirm in headless VM by mocking confirm)
if (typeof clearCart === 'function') {
    // monkey-patch global confirm to always return true for this run
    function confirm() { return true; }
    clearCart();
}
console.log('CART_AFTER_CLEAR::', JSON.stringify(cart));
// 10) Verify mableCart in localStorage
console.log('LOCALSTORED::', localStorage.getItem('mableCart'));
`;

const context = { console };
// provide a minimal localStorage mock for the VM
context.localStorage = {
    _store: {},
    getItem(key) { return this._store.hasOwnProperty(key) ? this._store[key] : null; },
    setItem(key, value) { this._store[key] = String(value); },
    removeItem(key) { delete this._store[key]; }
};
// minimal document mock to satisfy querySelectorAll used in addToCart
context.document = {
    querySelectorAll() {
        return [{
            classList: { add() {}, remove() {} },
            textContent: '0',
            style: { display: 'none' }
        }];
    }
};
// provide timers
context.setTimeout = setTimeout;
context.clearTimeout = clearTimeout;
vm.createContext(context);
try {
    vm.runInContext(scriptToRun, context, { timeout: 1000 });
} catch (err) {
    console.error('VM error:', err);
    process.exit(1);
}
