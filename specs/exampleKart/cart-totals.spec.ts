import { test, expect } from '@playwright/test';
import { SampleKartPage } from '../../pages/samplekart.page';
import products from '../../data/products.json';

test.describe('Cart and Price Calculations', () => {
  let g: SampleKartPage;

  test.beforeEach(async ({ page }) => {
    g = new SampleKartPage(page);
    await g.clearSession();
    await g.goto();
  });

  test('Add multiple products with different quantities', async () => {
    // Add items with various quantities
    await g.search(products.brocolli.name);
    await g.addToCartByName(products.brocolli.name); // Qty: 1

    await g.search(products.tomato.name);
    await g.setQuantity(products.tomato.name, 3);
    await g.addToCartByName(products.tomato.name); // Qty: 3

    await g.search(products.beans.name);
    await g.addToCartByName(products.beans.name); // Qty: 1

    // Calculate expected totals
    const expectedItems = 1 + 3 + 1;
    const expectedPrice = 
      products.brocolli.price * 1 + 
      products.tomato.price * 3 + 
      products.beans.price * 1;

    expect(await g.getHeaderItemsCount()).toBe(expectedItems);
    expect(await g.getHeaderPrice()).toBe(expectedPrice);
  });

  test.only('Cart persists after page refresh', async ({ page }) => {
    // Add an item
    await g.search(products.brocolli.name);
    await g.addToCartByName(products.brocolli.name);
    
    const itemsBefore = await g.getHeaderItemsCount();
    const priceBefore = await g.getHeaderPrice();

    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify cart state preserved
    expect(await g.getHeaderItemsCount()).toBe(itemsBefore);
    expect(await g.getHeaderPrice()).toBe(priceBefore);
  });

  test('Price calculation with high quantity items', async () => {
    await g.search(products.tomato.name);
    const highQty = 99;
    await g.setQuantity(products.tomato.name, highQty);
    await g.addToCartByName(products.tomato.name);

    expect(await g.getHeaderItemsCount()).toBe(highQty);
    expect(await g.getHeaderPrice()).toBe(products.tomato.price * highQty);
  });

  test('Cart updates when adding same product multiple times', async () => {
    await g.search(products.brocolli.name);
    
    // Add same product 3 times
    for (let i = 0; i < 3; i++) {
      await g.addToCartByName(products.brocolli.name);
    }

    // Site may either aggregate quantities or treat as separate line items
    const items = await g.getHeaderItemsCount();
    const price = await g.getHeaderPrice();
    
    expect(items).toBeGreaterThanOrEqual(1);
    expect(price).toBe(products.brocolli.price * items);
  });
});