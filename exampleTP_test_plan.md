# GreenKart (rahulshettyacademy.com/seleniumPractise) — Test Plan

## Executive summary
This document contains a comprehensive test plan for the GreenKart demo store at https://rahulshettyacademy.com/seleniumPractise/#/. The site provides a catalog of fruits and vegetables, a search box, quantity controls, add-to-cart actions, and a small cart indicator. The plan covers primary user journeys, happy paths, validation/negative cases, and edge conditions. Each scenario includes step-by-step instructions, expected outcomes, assumptions, success criteria, and failure conditions.

Assumed starting state for every scenario: fresh browser session (no localStorage/cart state), page opened at `https://rahulshettyacademy.com/seleniumPractise/#/`.

Key facts observed while exploring the page
- Page title: "GreenKart - veg and fruits kart"
- Search placeholder: "Search for Vegetables and Fruits"
- Product count observed: 31 (catalog has ~31 items)
- Example product (first 8): Brocolli - 1 Kg (₹120), Cauliflower - 1 Kg (₹60), Cucumber - 1 Kg (₹48), Beetroot - 1 Kg (₹32), Carrot - 1 Kg (₹56), Tomato - 1 Kg (₹16), Beans - 1 Kg (₹82), Brinjal - 1 Kg (₹35)
- Cart mini info shows Items/Price in header table; default Items = 0, Price = 0

## Primary user journeys (critical paths)
1. Browse catalog and view product details on the product card
2. Search for a product and add matching product(s) to cart
3. Adjust product quantity before adding
4. Add multiple distinct products to cart and verify cart totals
5. Remove items from cart or adjust quantities in cart (if cart modal or checkout allows)
6. Proceed to checkout (mini-cart -> checkout) and validate price calculation
7. Navigate to Top Deals (offers) and external links (e.g., Flight Booking)

## Test scenarios
Each scenario is independent and can be run in any order. Start state: new browser session, navigate to the home page.

### 1. Adding a single product (happy path)
Assumptions: Page is fully loaded.

Steps:
1. Focus the search input and ensure placeholder text is "Search for Vegetables and Fruits".
2. Type "Brocolli" (or partial "Bro"), press Enter or wait for client-side results to filter.
3. Verify the Brocolli product card is visible and price is ₹120.
4. Click the "ADD TO CART" button for Brocolli.

Expected results:
- The header cart Items count increases from 0 to 1.
- Header Price updates to the product price (₹120).
- The UI reflects the addition (cart icon / items cell updates).

Success criteria:
- Items cell reads `1` and Price cell reads `120` (or currency-format equivalent).

Failure conditions:
- Items remain `0` or price not updated.
- Product not found after search.

### 2. Add product with modified quantity before adding
Assumptions: Product cards include quantity controls (± links/spinbutton)

Steps:
1. Locate the product "Tomato - 1 Kg".
2. Click the `+` control twice to increase quantity to 3 (starting at 1).
3. Click "ADD TO CART".

Expected results:
- Header Items increment by 3 (or Items reflect total number-of-items convention used by the product; clarify whether items represent SKUs or units).
- Header Price is calculated as unitPrice * quantity (e.g., 16 * 3 = 48).

Success criteria:
- Items count and Price reflect quantity change precisely.

Failure conditions:
- Quantity ignored (defaults to 1).
- Incorrect price calculation.

### 3. Search filtering (happy path and partial match)
Assumptions: Search filters product list client-side.

Steps:
1. Type the partial string "appl".
2. Observe filtered results.
3. Verify that only products containing the string (case-insensitive) remain (e.g., "Apple - 1 Kg").
4. Clear search input.

Expected results:
- Filtered list contains relevant products (case-insensitive match).
- All other items hidden.

Edge cases:
- Search full match vs partial match; verify both work.
- Case-insensitivity.

Failure conditions:
- No results for an exact match that exists.
- Filtering is case-sensitive unexpectedly.

### 4. Search with no results (negative test)
Steps:
1. Type "nonexistentfruit123" into search.
2. Observe results.

Expected results:
- No product cards displayed or a "no results" state appears.
- Cart and header values remain unchanged.

Success criteria:
- UI gracefully handles zero-match queries without errors.

### 5. Add same product twice (idempotence / aggregation)
Steps:
1. Add "Cauliflower - 1 Kg" to cart (quantity 1).
2. Repeat add action on the same product without changing page or reload.

Expected results:
- Either the site increments the cart quantity for that SKU (e.g., Items become 2) or aggregates as expected by site behavior.
- Price is updated accordingly.

Failure conditions:
- Duplicate entries create separate lines and header counts don't reflect total units.

### 6. Add multiple different products and validate aggregated totals
Steps:
1. Add Brocolli (₹120) quantity 1.
2. Add Tomato (₹16) quantity 3.
3. Add Beans (₹82) quantity 1.
4. Observe header Items and Price.

Expected results:
- Items count should be the sum of units added (1 + 3 + 1 = 5) — confirm site convention; if site treats Items as number of distinct SKUs, adjust expectation accordingly.
- Price should be 120 + (16*3) + 82 = 120 + 48 + 82 = 250.

Success criteria:
- Header shows correct Items and Price.

### 7. Mini-cart interactions (open cart, verify line items, edit quantity/remove)
Assumptions: Clicking the Cart or cart icon opens a cart view or modal with line items and actions.

Steps:
1. Add a couple of items (e.g., Brocolli x1, Tomato x2).
2. Click the Cart link/icon in header.
3. Verify a cart view / cart modal / mini-cart shows line items, quantities, and per-line prices.
4. Edit a quantity (if inline edit present) or click remove on a line item.

Expected results:
- Cart view displays line-level details and subtotal.
- Removing or changing quantity updates the header counts and totals.

Failure conditions:
- Cart view missing or not showing correct quantities.
- UI errors when removing items.

### 8. Proceed to Checkout flow (if present)
Assumptions: Cart view contains a "PROCEED TO CHECKOUT" or similar action leading to a checkout page.

Steps:
1. Add items and open the cart.
2. Click "PROCEED TO CHECKOUT" (or equivalent).
3. Validate the checkout page shows correct items and the total price.

Expected results:
- Checkout page lists same items & prices as mini-cart.
- Any additional fees (taxes, shipping) are displayed and described.

Failure conditions:
- Mismatch between mini-cart and checkout totals.
- Broken navigation / JS errors.

### 9. Navigation to Top Deals / Offers (link behavior)
Steps:
1. Click the "Top Deals" link in header.
2. Verify it navigates to `#/offers` and shows expected content.

Expected results:
- Navigation occurs without full-page JS errors.
- The offers page shows a filtered set of products or deals.

### 10. External link behavior (Flight Booking / Rahul Shetty links)
Steps:
1. Click the "Flight Booking" or external course links.
2. Verify they open correct destinations (in same tab or new tab depending on link target).

Success criteria:
- Links navigate to expected URLs and are not broken.

### 11. Persistence checks (page refresh and session)
Steps:
1. Add some items to cart.
2. Refresh the page.

Expected results:
- Determine expected behavior: either cart is preserved (via localStorage/session) or resets.
- Document observed behavior and ensure it is consistent with product requirements.

Edge failures:
- Cart data disappears unexpectedly if persistence is required.

### 12. Boundary and edge-case testing for quantities
Tests:
- Try quantity 0 (if allowed) — expected to be disallowed or interpreted as remove.
- Try extremely large quantity (e.g., 9999) — expected to be capped or validated.
- Try non-integer input (if spin control allows direct text) — expected validation.

Expected results:
- UI validates or handles invalid quantities without crashing.

### 13. Price and rounding validation
Steps:
1. Add items with fractional or rounded prices (if present) and confirm price math.

Expected results:
- Totals are correct and rounding rules are consistent.

### 14. Accessibility quick checks
- Search input should have placeholder and accessible label.
- Buttons should be reachable via keyboard (Tab navigation) and actionable via Enter/Space.
- Verify color contrast on critical UI elements (cart counts, Add to Cart).

## Test data and selectors (recommended)
- Search input: input[placeholder="Search for Vegetables and Fruits"]
- Product card: `.product` (each card contains `h4` for name, `p` for price, `button` for add to cart)
- Quantity controls: `a` elements near `.product` (minus/plus) and a spinbutton `input` or `span` showing the current quantity
- Header cart table: `table` in header (first strong element shows items count observed as `0`)

Note: selectors above were inferred from the page snapshot during exploration; adjust them to more specific CSS selectors if the DOM differs.

## Execution notes for automation (Playwright)
- Use the observed selectors above to implement Playwright tests.
- For each scenario, include a pre-test step to clear localStorage / cookies to ensure a fresh session: `await page.context().clearCookies(); await page.evaluate(() => localStorage.clear());`
- Prefer assertions that check both UI and header values (e.g., assert item appears in cart view AND header items/price updated).

## Success criteria for overall test session
- All happy path scenarios pass with correct totals and cart behavior.
- Negative tests fail gracefully without JS errors (server 5xx or uncaught exceptions) and show user-friendly messages.
- Critical flows (Search -> Add -> Cart -> Checkout navigation) work end-to-end for at least 3 different SKUs.

## Appendix: Quick run checklist for manual testers
1. Open browser in incognito/private mode (ensures no cached cart)
2. Navigate to `https://rahulshettyacademy.com/seleniumPractise/#/`
3. Run scenarios in this document; capture expected vs actual results in your test runner or spreadsheet.

---

File created from an automated exploration session (title and selectors verified). If you want, I can:
- Convert the top scenarios into runnable Playwright test cases (with selectors & assertions), or
- Add a minimal checklist-style test-run table (pass/fail/comment) for manual QA.

Completion: test plan saved to `tests/rahulshetty_seleniumpractise_test_plan.md`.
