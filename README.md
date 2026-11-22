# UNKOOL Custom Store

A colourful, responsive custom-products storefront for T-shirts, mugs, keychains and pillows.

## Run locally
1. Install Node.js 20 or newer.
2. In this folder run `npm install`.
3. Run `npm run dev` and open the local URL Vite prints.

## WhatsApp
Orders open a WhatsApp chat to `+91 74472 48530` with product, custom text, quantity, customer and delivery details. If an image is uploaded, the customer is prompted to attach it in the WhatsApp chat; browsers do not let a website silently attach local files to WhatsApp.

## Enable Razorpay on Vercel
1. Create/activate a Razorpay merchant account and generate API keys in the Razorpay Dashboard.
2. In Vercel → Project → Settings → Environment Variables, add:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
3. Redeploy the project. Start with Razorpay test keys, test an order, then switch to live keys after account verification.
4. Never put the secret key in `src.jsx` or any frontend file.

The payment API creates server-side orders and verifies the checkout signature. For production, also add a Razorpay webhook and persist orders in a database before fulfilling them.

## Deploy to Vercel using GitHub
1. Create a new GitHub repository named `unkool-custom-store`.
2. Upload all files in this folder to the repository root (including `api/`).
3. In Vercel choose **Add New → Project**, import that GitHub repository, and deploy with the default Vite settings.
4. Add the Razorpay environment variables and redeploy.

## Customising
Edit product prices in `src.jsx` in the `products` array. Change the WhatsApp destination in the `WA` constant.
