import { test, expect } from '@playwright/test';

test.describe('contact', () => {
  test('should copy the email and show a confirmation', async ({ browser }) => {
    // Arrange
    const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage();
    await page.goto('/?lang=en#contact');

    // Act
    await page.getByRole('button', { name: 'Copy email' }).click();

    // Assert
    await expect(page.locator('[data-copy-status]')).toHaveText('Email copied to the clipboard');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('harlinacero@gmail.com');
    await context.close();
  });

  test('should offer email, linkedin, github and the cv without any phone number', async ({ page }) => {
    // Arrange / Act
    await page.goto('/?lang=es#contact');

    // Assert
    const contact = page.locator('#contact');
    await expect(contact.locator('a[data-action="email"]')).toHaveAttribute('href', 'mailto:harlinacero@gmail.com');
    await expect(contact.locator('a[data-action="download-cv"]')).toHaveAttribute('href', 'assets/cv/harlin-acero-cv-es.pdf');
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
    expect(await page.locator('body').innerText()).not.toMatch(/312\s?387/);
  });
});
