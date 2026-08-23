// Simulate shop.html Add to Cart flow
const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('script.js','utf8');

function extractBlock(code, startPhrase) {
    const start = code.indexOf(startPhrase);
    if (start === -1) return null;
    let i = start;
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

function extractArray(code, startIndex) {
    let i = code.indexOf('[', startIndex);
    if (i === -1) return null;
    let depth = 0;
    for (; i < code.length; i++) {
        if (code[i] === '[') depth++;
        else if (code[i] === ']') {
            depth--;
            if (depth === 0) {
                let j = i+1;
                while (j < code.length && code[j] !== ';' && code[j] !== '\n') j++;
                return code.slice(startIndex, j+1);
            }
        }
    }
    return null;
}

const prodIndex = code.indexOf('const products = [');
if (prodIndex === -1) { console.error('Products array not found'); process.exit(1); }
const productsBlock = extractArray(code, prodIndex);
if (!productsBlock) { console.error('Failed extracting products'); process.exit(1); }

const saveCartBlock = extractBlock(code, 'function saveCart(');
const addToCartBlock = extractBlock(code, 'function addToCart(');
const updateCartCountersBlock = extractBlock(code, 'function updateCartCounters(');
const createProductCardBlock = extractBlock(code, 'function createProductCard(');

if (!saveCartBlock || !addToCartBlock) { console.error('Failed to extract functions'); process.exit(1); }

const scriptToRun = `
const storeConfig = { currencySymbol: 'R', deliveryFee: 50 };
${productsBlock}
let cart = [];
let wishlist = [];
${saveCartBlock}
${addToCartBlock}
${updateCartCountersBlock || ''}
${createProductCardBlock || ''}

// Mock document and globals
const mockCartElements = [{ classList: { add(){}, remove(){} }, textContent: '0', style: { display: 'none' } }];
function getElementById(id) { return null; }
function querySelectorAll(sel) { 
    if (sel === '.cart-count') return mockCartElements; 
    return [];
}
const document = { getElementById, querySelectorAll };

// Mocks
function showToast(msg, type) { console.log('TOAST:', msg); }
function formatCurrency(amount) { return 'R' + Number(amount).toFixed(2); }
function toggleWishlist() {}
function openQuickView() {}

// Simulate: user clicks Add to Cart on shop page for product p1
console.log('>>> Simulating Add to Cart click on p1');
addToCart(null, 'p1', 1);

console.log('=== AFTER FIRST ADD ===');
console.log('Cart:', JSON.stringify(cart));
console.log('localStorage mableCart:', localStorage.getItem('mableCart'));

// Simulate: user clicks Add to Cart again for p1
console.log('\\n>>> Simulating Add to Cart click on p1 again');
addToCart(null, 'p1', 1);

console.log('=== AFTER SECOND ADD (same product) ===');
console.log('Cart:', JSON.stringify(cart));
console.log('localStorage mableCart:', localStorage.getItem('mableCart'));

// Check if cart counter was updated
console.log('\\n=== CART COUNTER CHECK ===');
const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
console.log('Total items calculated:', totalItems);
console.log('Cart count element textContent:', mockCartElements[0].textContent);
console.log('Cart count element display:', mockCartElements[0].style.display);
`;

const context = { console };
context.localStorage = {
    _store: {},
    getItem(key) { return this._store.hasOwnProperty(key) ? this._store[key] : null; },
    setItem(key, value) { this._store[key] = String(value); },
    removeItem(key) { delete this._store[key]; }
};
context.setTimeout = setTimeout;
context.clearTimeout = clearTimeout;

vm.createContext(context);
try {
    vm.runInContext(scriptToRun, context, { timeout: 2000 });
} catch (err) {
    console.error('VM error:', err.message);
    process.exit(1);
}
