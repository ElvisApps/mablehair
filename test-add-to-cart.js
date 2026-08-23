const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = `<!doctype html><html><head></head><body>
<span class="cart-count" style="display:none">0</span>
</body></html>`;

const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
const { window } = dom;

global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;
global.navigator = window.navigator;

// Load the app script into the JSDOM environment
const scriptContent = fs.readFileSync('script.js', 'utf8');
const scriptEl = window.document.createElement('script');
scriptEl.textContent = scriptContent;
window.document.body.appendChild(scriptEl);

setTimeout(() => {
  try {
    console.log('mableCart before:', window.localStorage.getItem('mableCart'));

    if (typeof window.addToCart !== 'function') {
      console.error('addToCart not available on window');
      process.exit(2);
    }

    // Add product p1
    window.addToCart(null, 'p1', 1);

    setTimeout(() => {
      console.log('mableCart after add:', window.localStorage.getItem('mableCart'));
      const cart = JSON.parse(window.localStorage.getItem('mableCart') || '[]');
      console.log('cart length:', cart.length);
      console.log('cart[0]:', cart[0]);
      console.log('cart-count element text:', window.document.querySelector('.cart-count').textContent);
      process.exit(0);
    }, 200);

  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}, 200);
