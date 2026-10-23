import { test, expect } from '@playwright/test';

const horizontalOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test.describe('phone layout', () => {
  test('should collapse the menu and have no horizontal scroll on a phone', async ({ page }) => {
    // Arrange
    await page.goto('/?lang=en');
    const toggle = page.locator('#menu-toggle');

    // Act / Assert
    await expect(toggle).toBeVisible();
    await expect(page.locator('#site-nav')).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#site-nav')).toBeVisible();
    await page.locator('#site-nav').getByRole('link', { name: 'Contact' }).click();
    await expect(page.locator('#site-nav')).toBeHidden();
    await expect(page.locator('#contact h2')).toBeInViewport();
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test('should keep the diagram inside its frame without page horizontal scroll', async ({ page }) => {
    // Arrange
    await page.goto('/?lang=es#architecture');
    const frame = page.locator('#case-microservicesDemo .diagram__frame');

    // Act
    const { scrollWidth, clientWidth } = await frame.evaluate((el) => ({ scrollWidth: el.scrollWidth, clientWidth: el.clientWidth }));
    await frame.evaluate((el) => { el.scrollLeft = el.scrollWidth; });

    // Assert
    expect(scrollWidth).toBeGreaterThan(clientWidth);
    expect(await frame.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
