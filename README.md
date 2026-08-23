# Mable Hair Care - E-Commerce Frontend

A fully functional, modern, and interactive e-commerce website for Mable Hair Care. Built securely using **HTML, CSS, and Vanilla JavaScript**.

## Project Features
- **Frontend**: Responsive UI, Cart state management via `localStorage`, Wishlist, Search/Filter, Checkout.
- **Backend/Email**: Serverless email dispatch powered securely via a Google Apps Script Web App Endpoint.
- **Currency**: Fully localized to South African Rand (ZAR / R).

---

## Secure Configuration & Editing

### 1. Changing Products and Prices
Do **NOT** edit HTML files to change product prices.
Open `script.js` and locate the `products` array at the top. 
- You can change the `price` value directly (e.g., `price: 150.00`). 
- Change `description`, `ingredients`, or add new items. The rest of the site (Shop, Cart, Products) updates automatically!

### 2. Changing Store Details (Banking, Delivery)
Open `script.js` and locate the `storeConfig` object at the top.
You can securely update your **Banking Details** for EFT and **Delivery Fee** here. These details are pulled into the checkout process dynamically.

### 3. Configuring the Email Backend (Google Apps Script)
To ensure Google OAuth credentials and client secrets are **never** exposed to GitHub or the public internet, this site uses a secure Google Apps Script Web App.

**How to set it up:**
1. Go to [script.google.com](https://script.google.com/) and create a "New Project".
2. Name it "Mable Hair Care Emails".
3. Open the `google-apps-script/Code.gs` file in this repository, copy all the code, and paste it into your Google Apps Script editor.
4. (Optional) Update your banking details inside the `Code.gs` file (around line 59) so the automated emails include the correct information.
5. Click **Deploy > New Deployment**.
6. Set type to **Web app**.
7. Execute as: **Me**.
8. Who has access: **Anyone**. (This allows the website to trigger the emails).
9. Click **Deploy** and authorize the script to send emails on your behalf.
10. Copy the **Web app URL**.
11. Paste this URL into `script.js` under `storeConfig.apiEndpoint`.

Your website can now securely send order confirmations and contact forms directly to `info@mablehair.co.za`!

---

## Deployment to GitHub Pages

1. **Upload**: Push this entire directory to a public repository on GitHub. (Since all secrets are in the Apps Script environment, it is safe to be public).
2. **Enable Pages**: Go to the repository **Settings** > **Pages**. Set the source branch to `main` (or `master`) and save.
3. **Live**: Your site will be live within a few minutes!

## Security Notice
Do not hardcode API keys, passwords, or client secrets inside `script.js` or any HTML files. The current architecture successfully adheres to secure deployment practices for static frontends.
