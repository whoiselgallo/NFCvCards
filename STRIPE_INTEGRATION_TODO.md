# Stripe Checkout Integration Guide & Status

This file is the single source of truth for the Stripe Checkout integration and remaining setup steps.

## Values to Replace

The following parameters are currently configured. In Scenario A, existing real application values have been preserved. If you wish to switch from ad-hoc dynamic `price_data` to pre-created Stripe Dashboard Product & Price IDs or adjust endpoints, update the following fields before going live:

**Files containing parameters:**
- [app/api/checkout/route.js](app/api/checkout/route.js)
- [app/api/checkout/stripe/route.js](app/api/checkout/stripe/route.js)

| Field | Current Value | What to Set |
|-------|--------------|-------------|
| mode | `mode` / `payment` | Set to `"payment"` for one-time charges or `"subscription"` for recurring billing. |
| success_url | Dynamic (`${originUrl}/builder?...`) | Your actual post-payment success page URL. Keep the `{CHECKOUT_SESSION_ID}` template parameter where needed. |
| cancel_url | Dynamic (`${originUrl}/#pricing`, `${originUrl}/builder?...`) | Your actual cancel/return page URL. |
| line_items | Dynamic `price_data` (MXN currency) | If using Stripe Dashboard pre-configured prices, replace with `price: 'price_...'` from [Stripe Dashboard Prices](https://dashboard.stripe.com/prices). |

---

## Configured Parameters

These parameters were configured in Checkout Studio and are already set correctly.

**Files containing these parameters:**
- [app/api/checkout/route.js](app/api/checkout/route.js)
- [app/api/checkout/stripe/route.js](app/api/checkout/stripe/route.js)

| Parameter | Value |
|-----------|-------|
| `ui_mode` | `hosted_page` (Stripe SDK $\ge$ 21.0.0) |
| `billing_address_collection` | `auto` |
| `phone_number_collection` | `{ "enabled": false }` |
| `automatic_tax` | `{ "enabled": true }` |
| `allow_promotion_codes` | `true` |
| `submit_type` | `auto` |
| `integration_identifier` | `hosted_web_0001` |
| `origin_context` | `web` |
| `payment_method_collection` | `always` (configured conditionally when `mode === 'subscription'`) |

---

## Setup and Next Steps

### 1. Environment Variables & API Keys
Ensure your `.env` (or production environment configuration) contains valid Stripe keys:
```env
# Stripe Secret Key (Dashboard -> Developers -> API keys)
STRIPE_SECRET_KEY=sk_test_...

# Stripe Webhook Secret (Dashboard -> Developers -> Webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...
```
- Dependencies: `stripe` (`^22.6.1`) is already installed in `package.json`.

### 2. Project Structure & Files Modified
- [app/api/checkout/route.js](app/api/checkout/route.js) — Main subscription and tier checkout route; updated `sessionParams` to match Field Intents.
- [app/api/checkout/stripe/route.js](app/api/checkout/stripe/route.js) — Single package & physical NFC card checkout route; updated `stripe.checkout.sessions.create` call to match Field Intents.
- [STRIPE_INTEGRATION_TODO.md](STRIPE_INTEGRATION_TODO.md) — Single source of truth documentation.

### 3. How the Integration Works (Flow Overview)
1. **Initiation**: The customer selects a digital business card plan or physical NFC package and clicks Checkout.
2. **Server-Side Session Creation**: The client calls `/api/checkout` or `/api/checkout/stripe`. The server initializes a Stripe Checkout Session with `ui_mode: 'hosted_page'`, enabling automated tax calculation, coupon codes, and standardized address collection.
3. **Redirection**: The server returns `{ success: true, url: session.url }`, redirecting the customer to Stripe's secure hosted payment page.
4. **Completion & Return**: Upon completing payment, Stripe redirects the customer back to `success_url` (`/builder?payment=success&...`), or to `cancel_url` if cancelled.
5. **Fulfillment (Webhook)**: Stripe sends `checkout.session.completed` to your webhook endpoint to grant access, save customer/subscription IDs, and update database records.

### 4. Testing Credit Card Numbers & Test Modes
To test transactions in Stripe Test Mode (`sk_test_...`):
- **Card Number**: `4242 4242 4242 4242`
- **Expiration Date**: Any valid future month/year (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **Postal Code**: Any 5 digits (e.g., `90210` or `21000`)
- Refer to [Stripe Testing Documentation](https://docs.stripe.com/testing) for 3D Secure and international decline scenarios.

### 5. Next Steps
- [ ] Verify test mode end-to-end checkout on both digital plans and physical card orders.
- [ ] Ensure automatic tax settings are activated in the [Stripe Tax Dashboard](https://dashboard.stripe.com/tax).
- [ ] Verify webhook endpoint registration in the [Stripe Webhooks Dashboard](https://dashboard.stripe.com/webhooks) pointing to `/api/webhooks/stripe`.
- [ ] Replace test API keys with production keys (`sk_live_...`) before launch.

### Resources
- [Stripe Support](https://support.stripe.com)
- [Stripe Documentation & MCP](https://docs.stripe.com/mcp)
