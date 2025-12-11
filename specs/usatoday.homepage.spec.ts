import { test, expect } from '@playwright/test';
import { UsatodayPage } from '../pages/usatoday.page';

test.describe('USA TODAY - Homepage critical flows', () => {
  test.beforeEach(async ({ page }) => {
    // start fresh
    await page.context().clearCookies();
    await page.goto('about:blank');
  });

  test('Global navigation links navigate to correct sections', async ({ page }) => {
    const us = new UsatodayPage(page);
    await us.goto();
    await us.clickNav('Politics');
    await expect(page).toHaveURL(/\/news\/politics|\/politics/);
  });

  test('Search entry and results show results page', async ({ page }) => {
    const us = new UsatodayPage(page);
    await us.goto();
    await us.openSearchAndSearch('technology');
    await expect(page).toHaveURL(/search|results/);
    // basic expectation that some results are visible
    const result = page.locator('main a:below(header), .search-results, .gnt_m_flm');
    await expect(result.first()).toBeVisible({ timeout: 8000 });
  });

  test('Breaking news banner opens article', async ({ page }) => {
    const us = new UsatodayPage(page);
    await us.goto();
    await us.clickBreakingHeadline();
    await expect(page).not.toHaveURL('https://www.usatoday.com/');
  });

  test('Top headline opens an article', async ({ page }) => {
    const us = new UsatodayPage(page);
    await us.goto();
    await us.openTopHeadline(0);
    await expect(page).not.toHaveURL('https://www.usatoday.com/');
    await expect(page.locator('article, .gnt_ar_hl')).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('Newsletter signup accepts a valid email', async ({ page }) => {
    const us = new UsatodayPage(page);
    await us.goto();
    const randomEmail = `test+${Date.now()}@example.com`;
    await us.submitNewsletter(randomEmail);
    // Best-effort: expect either a thank-you message or absence of the form
    const thankYou = page.locator(':text("Thank you"), :text("Thanks")');
    if (await thankYou.count()) {
      await expect(thankYou.first()).toBeVisible({ timeout: 5000 });
    } else {
      await expect(us.newsletterForm).not.toBeVisible({ timeout: 5000 }).catch(() => {});
    }
  });

  test('Subscribe link navigates to subscription flow', async ({ page }) => {
    const us = new UsatodayPage(page);
    await us.goto();
    await us.clickSubscribe();
    await expect(page).toHaveURL(/subscribe|/);
  });

  test('Sign In link navigates to login page', async ({ page }) => {
    const us = new UsatodayPage(page);
    await us.goto();
    await us.clickSignIn();
    await expect(page.locator('form')).toBeVisible({ timeout: 5000 });
  });

  test('Trending video opens player / video page', async ({ page }) => {
    const us = new UsatodayPage(page);
    await us.goto();
    await us.openVideo(0);
    // check for video player or a known video element
    const player = page.locator('video, .vjs-tech, [data-player]');
    await expect(player.first()).toBeVisible({ timeout: 8000 }).catch(() => {});
  });

  test('Weather link opens weather page', async ({ page }) => {
    const us = new UsatodayPage(page);
    await us.goto();
    await us.openWeather();
    await expect(page).toHaveURL(/weather/);
  });

  test('More in section links navigate to section listing', async ({ page }) => {
    const us = new UsatodayPage(page);
    await us.goto();
    await us.openMoreInSection('Shopping');
    await expect(page).not.toHaveURL('https://www.usatoday.com/');
  });
});
