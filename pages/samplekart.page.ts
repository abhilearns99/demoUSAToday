// spec helpers: Page Object for GreenKart
import { Page, Locator } from '@playwright/test';

export class SamplekartPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly products: Locator;
  readonly headerItems: Locator;
  readonly headerPrice: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[placeholder="Search for Vegetables and Fruits"]');
    this.products = page.locator('.products .product');
    // header table strong elements: first is items, last is price
    this.headerItems = page.locator('table tr td strong').first();
    this.headerPrice = page.locator('table tr td strong').last();
    this.cartIcon = page.locator('img[alt="Cart"]');
  }

  async goto() {
    await this.page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
    await this.page.waitForLoadState('networkidle');
  }

  async clearSession() {
    await this.page.context().clearCookies();
    // await this.page.evaluate(() => localStorage.clear());
  }

  async search(text: string) {
    await this.searchInput.fill(text);
    // small wait for client-side filter to apply
    await this.page.waitForTimeout(400);
  }

  async getVisibleProductNames() {
    return await this.page.locator('.products .product h4').allInnerTexts();
  }

  productSelector(name: string) {
    return `.product:has(h4:has-text("${name}"))`;
  }
// Replace the productSelector method with this more robust approach:
private getProductCard(name: string): Locator {
  return this.page.locator('.product', {
    has: this.page.locator('h4', { hasText: name })
  });
}
  async addToCartByName(name: string) {
    const btn = this.page.locator(`${this.productSelector(name)} >> button:has-text("ADD TO CART")`);
    await btn.waitFor({ state: 'visible', timeout: 3000 });
    await btn.click();
    // wait briefly for header update
    await this.page.waitForTimeout(300);
  }

  async setQuantity(name: string, qty: number) {
    const input = this.page.locator(`${this.productSelector(name)} >> input`);
    const current = parseInt(await input.inputValue());
    const diff = qty - current;
    if (diff > 0) {
      const plus = this.page.locator(`${this.productSelector(name)} >> a:has-text("+")`);
      for (let i = 0; i < diff; i++) await plus.click();
    } else if (diff < 0) {
      const minus = this.page.locator(`${this.productSelector(name)} >> a:has-text("–")`);
      for (let i = 0; i < Math.abs(diff); i++) await minus.click();
    }
    await this.page.waitForTimeout(200);
  }

  async getHeaderItemsCount(): Promise<number> {
    const txt = await this.headerItems.innerText();
    return parseInt(txt || '0');
  }

  async getHeaderPrice(): Promise<number> {
    const txt = await this.headerPrice.innerText();
    return parseInt(txt || '0');
  }
}
