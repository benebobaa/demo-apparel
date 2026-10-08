# Halden — ecommerce storefront demo

A single-page fashion storefront for demoing to prospective store owners. Halden is a fictional brand.
Everything on the page is real and working: no mock buttons.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (also reachable from your phone on the same wifi)
npm run build      # production build into dist/
npm run preview    # serve the production build
```

Fonts are bundled (no CDN) and there are no external requests, so the demo works with no internet.

## What to show in the meeting

1. **Add to bag.** Hover a product, pick a size, add it. The bag slides out with the running subtotal.
2. **Free-delivery nudge.** The bar at the top of the bag fills as the order grows toward the threshold.
3. **It remembers.** Reload the page. The bag is still there (stored in `localStorage`).
4. **Filter.** Use the category tabs above the grid. No page reload.
5. **Phone.** Open it on a phone. The size and add controls sit under each product instead of on hover.
6. **Checkout** shows a toast explaining that it connects to a payment provider in a real store.

## Make it theirs

| To change             | Edit                                                                  |
| --------------------- | --------------------------------------------------------------------- |
| Brand, currency, free-shipping threshold | `CONFIG` in `src/products.js`                       |
| Products, prices, sizes, colours | `products` in `src/products.js`                            |
| Colours and fonts     | the `:root` tokens at the top of `src/style.css`                      |
| Copy and sections     | `index.html`                                                          |

**Rupiah:** in `CONFIG`, set `locale: 'id-ID'`, `currency: 'IDR'`, `priceMultiplier: 16000`.

**Real photos:** products are drawn as SVG (`src/art.js`) so the demo looks consistent offline. To use photography,
put images in `public/img/` and set `image: '/img/field-coat.jpg'` on a product. Photos use a 4:5 crop.

## Structure

```
index.html        page markup
src/main.js       rendering, filters, cart drawer, interactions
src/cart.js       cart state + localStorage persistence
src/products.js   brand config + catalogue (edit this first)
src/art.js        garment illustrations
src/style.css     design tokens + all styles
```

## Notes

- Respects `prefers-reduced-motion`; the cart drawer is keyboard accessible (Esc closes, focus is trapped and restored).
- Checkout, payments, accounts and a backend are intentionally not included. This is a front-end demo.
