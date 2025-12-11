import { Page, Locator, expect } from '@playwright/test';

export class UsatodayPage {
  readonly page: Page;
  readonly nav: Locator;
  readonly searchToggle: Locator;
  readonly searchInput: Locator;
  readonly breakingBannerLink: Locator;
  readonly topHeadlines: Locator;
  readonly newsletterForm: Locator;
  readonly newsletterEmailInput: Locator;
  readonly newsletterSubmit: Locator;
  readonly subscribeLink: Locator;
  readonly signInLink: Locator;
  readonly weatherLink: Locator;
  readonly videoCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.locator('nav');
    this.searchToggle = page.locator('a:has-text("Search"), button[aria-label="Search"]');
    this.searchInput = page.locator('input[placeholder="Search"], input[name="q"], input[type="search"]');
    this.breakingBannerLink = page.locator('a:has-text("BREAKING"), [aria-label*="Breaking"] a, [role="region"] a:has-text("BREAKING")').first();
    this.topHeadlines = page.locator('main a').filter({ has: page.locator(':text("Top Headlines"), :text("Top Stories")') });
    this.newsletterForm = page.locator('form:has(input[placeholder="Email Address"])');
    this.newsletterEmailInput = this.newsletterForm.locator('input[placeholder="Email Address"]');
    this.newsletterSubmit = this.newsletterForm.locator('button[type="submit"], button:has(img), button:has-text("Submit")');
    this.subscribeLink = page.locator('a:has-text("Subscribe"), a[href*="subscribe"]');
    this.signInLink = page.locator('a:has-text("Sign In"), a[href*="login"], a[href*="signin"]');
    this.weatherLink = page.locator('a:has-text("Weather"), a[href*="/weather"]');
    this.videoCards = page.locator('main a:has(img), [data-analytics*="video"], .video-card');
  }

  async goto() {
    await this.page.goto('https://www.usatoday.com/');
    await this.waitForMainContent();
  }

  async waitForMainContent() {
    // Wait for a clear main area to be present
    await this.page.locator('main').first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickNav(section: string) {
    const link = this.nav.locator('a', { hasText: section });
    await expect(link).toBeVisible({ timeout: 5000 });
    await link.click();
    // allow navigation
    await this.page.waitForLoadState('networkidle');
  }

  async openSearchAndSearch(query: string) {
    if (await this.searchToggle.count()) {
      await this.searchToggle.first().click();
    }
    await this.searchInput.fill(query, { timeout: 5000 });
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async clickBreakingHeadline() {
    const candidate = this.breakingBannerLink;
    if (await candidate.count()) {
      await candidate.click();
      await this.page.waitForLoadState('load');
    } else {
      throw new Error('Breaking banner link not found');
    }
  }

  async openTopHeadline(index = 0) {
    const headline = this.page.locator('main a').filter({ has: this.page.locator('h2, h3, h4') }).nth(index);
    await expect(headline).toBeVisible({ timeout: 5000 });
    await headline.click();
    await this.page.waitForLoadState('load');
  }

  async submitNewsletter(email: string) {
    await expect(this.newsletterForm).toBeVisible({ timeout: 5000 });
    await this.newsletterEmailInput.fill(email);
    await Promise.all([
      this.page.waitForResponse(resp => resp.status() === 200 || resp.status() === 201, { timeout: 8000 }).catch(() => null),
      this.newsletterSubmit.click()
    ]);
  }

  async clickSubscribe() {
    await expect(this.subscribeLink).toBeVisible({ timeout: 5000 });
    await this.subscribeLink.first().click();
    await this.page.waitForLoadState('load');
  }

  async clickSignIn() {
    await expect(this.signInLink).toBeVisible({ timeout: 5000 });
    await this.signInLink.first().click();
    await this.page.waitForLoadState('load');
  }

  async openVideo(index = 0) {
    const card = this.videoCards.nth(index);
    await expect(card).toBeVisible({ timeout: 5000 });
    await card.click();
    // wait for either a video player or load
    await this.page.waitForLoadState('networkidle');
  }

  async openWeather() {
    await expect(this.weatherLink).toBeVisible({ timeout: 5000 });
    await this.weatherLink.first().click();
    await this.page.waitForLoadState('load');
  }

  async openMoreInSection(section: string) {
    const more = this.page.locator(`a:has-text("More in ${section}")`, { timeout: 3000 });
    if (await more.count()) {
      await more.first().click();
      await this.page.waitForLoadState('load');
    } else {
      // fallback: click section link then check list
      await this.clickNav(section);
    }
  }
}
