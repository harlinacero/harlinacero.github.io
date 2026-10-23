import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('accessibility', () => {
  test('should show the full headline without animations when reduced motion is requested', async ({ page }) => {
    // Arrange
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Act
    await page.goto('/?lang=en');
    await page.waitForTimeout(3000);

    // Assert
    await expect(page.locator('[data-typing]')).toHaveText('designing distributed systems');
    const hiddenReveals = await page.locator('.reveal').evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity !== '1').length);
    expect(hiddenReveals).toBe(0);
    const animation = await page.locator('.hero__photo-ring').evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe('none');
  });

  test('should reach every interactive element by keyboard with visible focus', async ({ page }) => {
    // Arrange
    await page.goto('/?lang=en');
    const expected = await page.evaluate(() => [...document.querySelectorAll('a[href], button, [tabindex="0"]')]
      .filter((el) => el.offsetParent !== null && el.tabIndex >= 0 && !el.closest('[hidden]'))
      .length);

    // Act
    const reached = new Set();
    for (let i = 0; i < expected + 5; i += 1) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (el === document.body) return null; // focus left the page after the last element
        const key = [el.tagName, el.id, el.getAttribute('href'), el.textContent.trim().slice(0, 30),
          [...el.parentElement.children].indexOf(el), el.closest('section, header, footer')?.id ?? el.closest('section, header, footer')?.className].join('|');
        return { key, outline: getComputedStyle(el).outlineStyle };
      });
      if (!info) continue;
      reached.add(info.key);
      expect(info.outline, `no visible focus on ${info.key}`).not.toBe('none');
    }

    // Assert
    expect(reached.size).toBeGreaterThanOrEqual(expected);
  });

  for (const lang of ['en', 'es']) {
    test(`should report no serious or critical axe violations in ${lang}`, async ({ page }) => {
      // Arrange
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`/?lang=${lang}`);
      await page.locator('#contact').waitFor();

      // Act
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

      // Assert
      const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
    });
  }
});
