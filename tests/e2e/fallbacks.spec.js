import { test, expect } from '@playwright/test';

test.describe('fallbacks', () => {
  test('should show the error message with linkedin and cv links when content fails to load', async ({ browser }) => {
    // Arrange
    const context = await browser.newContext({ locale: 'es-CO' });
    const page = await context.newPage();
    await page.route('**/content/profile.json', (route) => route.abort());

    // Act
    await page.goto('/');

    // Assert
    const error = page.locator('#load-error');
    await expect(error).toBeVisible();
    await expect(error.locator('h1')).toHaveText('Lo siento, no se pudo cargar la hoja de vida.');
    await expect(error.getByRole('link', { name: 'Perfil de LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/harlinacero');
    await expect(error.getByRole('link', { name: 'Descargar CV (PDF)' })).toHaveAttribute('href', 'assets/cv/harlin-acero-cv-es.pdf');
    await context.close();
  });

  test('should show name, headline and links when javascript is disabled', async ({ browser }) => {
    // Arrange
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    // Act
    await page.goto('/');

    // Assert
    const fallback = page.locator('.noscript');
    await expect(fallback.locator('h1')).toHaveText('Harlin Acero');
    await expect(fallback).toContainText('Software Engineer & Software Architect');
    await expect(fallback.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
    await expect(fallback.getByRole('link', { name: 'GitHub' })).toBeVisible();
    await expect(fallback.getByRole('link', { name: 'CV (English, PDF)' })).toHaveAttribute('href', 'assets/cv/harlin-acero-cv-en.pdf');
    await context.close();
  });
});
