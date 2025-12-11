import { test, expect } from '@playwright/test';
import { GreenKartPage } from '../../pages/samplekart.page';
import products from '../../data/products.json';

test.describe('Add to Cart Features', () => {
  let g: GreenKartPage;

  test.beforeEach(async ({ page }) => {
    g = new GreenKartPage(page);
    await g.clearSession();
    await g.goto();
  });

  test('Add single product with default quantity', async () => {
    await g.search(products.brocolli.name);
    await g.addToCartByName(products.brocolli.name);
    
    expect(await g.getHeaderItemsCount()).toBe(1);
    expect(await g.getHeaderPrice()).toBe(products.brocolli.price);
  });

  test.only('Add product with modified quantity', async () => {
    const qty = 3;
    await g.search(products.tomato.name);
    await g.setQuantity(products.tomato.name, qty);
    await g.addToCartByName(products.tomato.name);
    
    expect(await g.getHeaderItemsCount()).toBe(qty);
    expect(await g.getHeaderPrice()).toBe(products.tomato.price * qty);
  });

  test('Add same product twice', async () => {
    await g.search(products.cauliflower.name);
    
    // Add first time
    await g.addToCartByName(products.cauliflower.name);
    const firstCount = await g.getHeaderItemsCount();
    const firstPrice = await g.getHeaderPrice();
    
    // Add second time
    await g.addToCartByName(products.cauliflower.name);
    const secondCount = await g.getHeaderItemsCount();
    const secondPrice = await g.getHeaderPrice();
    
    // Verify counts increased
    expect(secondCount).toBeGreaterThan(firstCount);
    expect(secondPrice).toBeGreaterThan(firstPrice);
  });

  test('Quantity cannot go below 1', async () => {
    await g.search(products.tomato.name);
    await g.setQuantity(products.tomato.name, 1);
    
    // Try to set quantity to 0
    await g.setQuantity(products.tomato.name, 0);
    
    // Verify minimum quantity enforced
    const card = g.getProductCard(products.tomato.name);
    const input = card.locator('input');
    const qty = await input.inputValue();
    expect(parseInt(qty)).toBeGreaterThan(0);
  });
});