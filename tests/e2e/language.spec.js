import { test, expect } from '@playwright/test';

const ENGLISH_ONLY = ['View code', 'Featured projects', 'Leadership & architecture', 'Key decisions', 'Download CV'];

test.describe('language switch', () => {
  test('should switch every text and keep the position when toggling language', async ({ page }) => {
    // Arrange
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/?lang=en');
    await page.locator('#projects').evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    const toggle = page.locator('#lang-toggle');
    await expect(toggle).toHaveText('ES');

    // Act
    await toggle.click();

    // Assert
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('#projects h2')).toHaveText('Proyectos destacados');
    await expect(page.locator('#projects h2')).toBeInViewport();
    await expect(toggle).toHaveText('EN');
    const body = await page.locator('body').innerText();
    ENGLISH_ONLY.forEach((text) => expect(body).not.toContain(text));
    await expect(page).toHaveURL(/\?lang=es/);

    await toggle.click();
    await expect(page.locator('#projects h2')).toHaveText('Featured projects');
    expect(errors).toEqual([]);
  });

  test('should open in spanish when the browser locale is es-CO', async ({ browser }) => {
    // Arrange
    const context = await browser.newContext({ locale: 'es-CO' });
    const page = await context.newPage();

    // Act
    await page.goto('/');

    // Assert
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('#hero .hero__headline')).toHaveText('Ingeniero de Software y Arquitecto de Software');
    await context.close();
  });

  test('should open in the remembered language on return', async ({ browser }) => {
    // Arrange
    const context = await browser.newContext({ locale: 'en-US' });
    const page = await context.newPage();
    await page.goto('/');
    await page.locator('#lang-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    // Act
    const returning = await context.newPage();
    await returning.goto('/');

    // Assert
    await expect(returning.locator('html')).toHaveAttribute('lang', 'es');
    await context.close();
  });

  test('should honor lang in the url over the remembered choice', async ({ page }) => {
    // Arrange
    await page.addInitScript(() => window.localStorage.setItem('hac.lang', 'es'));

    // Act
    await page.goto('/?lang=en');

    // Assert
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('#projects h2')).toHaveText('Featured projects');
  });

  test('should switch language without errors when storage throws', async ({ page }) => {
    // Arrange
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } });
    });
    await page.goto('/?lang=en');

    // Act
    await page.locator('#lang-toggle').click();

    // Assert
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    expect(errors).toEqual([]);
  });
});
