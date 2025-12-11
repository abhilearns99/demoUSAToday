import { test, expect } from '@playwright/test';
import { GreenKartPage } from '../pages/greenkart.page';

test.describe('Search and Filter Features', () => {
  let g: GreenKartPage;

  test.beforeEach(async ({ page }) => {
    g = new GreenKartPage(page);
    await g.clearSession();
    await g.goto();
  });

  test('Search with exact match', async () => {
    await g.search('Brocolli - 1 Kg');
    const names = await g.getVisibleProductNames();
    expect(names.length).toBe(1);
    expect(names[0]).toBe('Brocolli - 1 Kg');
  });

  test('Search with partial match - start of word', async () => {
    await g.search('Car');
    const names = await g.getVisibleProductNames();
    expect(names.some(n => n.includes('Carrot'))).toBeTruthy();
  });

  test('Search with partial match - middle of word', async () => {
    await g.search('berry');
    const names = await g.getVisibleProductNames();
    expect(names.filter(n => n.toLowerCase().includes('berry')).length).toBeGreaterThanOrEqual(2);
  });

  test('Search is case insensitive', async () => {
    await g.search('BROCOLLI');
    const names = await g.getVisibleProductNames();
    expect(names.some(n => n.includes('Brocolli'))).toBeTruthy();
  });

  test('Clear search resets product list', async () => {
    await g.search('Apple');
    await g.search(''); // Clear search
    const names = await g.getVisibleProductNames();
    expect(names.length).toBeGreaterThan(20); // Full catalog visible
  });

  test('Special characters handled gracefully', async () => {
    await g.search('!@#$%');
    const names = await g.getVisibleProductNames();
    expect(names.length).toBe(0);
  });
});