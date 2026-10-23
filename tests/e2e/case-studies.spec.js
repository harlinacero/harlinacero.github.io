import { test, expect } from '@playwright/test';

test.describe('architecture case studies', () => {
  test('should open the case study from its project card', async ({ page }) => {
    // Arrange
    await page.goto('/?lang=en');
    const card = page.locator('[data-project="eCommerceMajestic"]');

    // Act
    await card.getByRole('link', { name: 'Architecture' }).click();

    // Assert
    const panel = page.locator('#case-eCommerceMajestic');
    await expect(panel).toBeVisible();
    await expect(panel.locator('h3')).toBeInViewport();
    await expect(panel.locator('.decision')).toHaveCount(5);
    await expect(panel.getByRole('link', { name: /View code/ })).toHaveAttribute('target', '_blank');
  });

  test('should switch between case studies without leaving the page', async ({ page }) => {
    // Arrange
    await page.goto('/?lang=en#architecture');
    const url = page.url();

    // Act
    await page.getByRole('tab', { name: 'EmployeeAttendanceControl' }).click();

    // Assert
    await expect(page.locator('#case-employeeAttendanceControl')).toBeVisible();
    await expect(page.locator('#case-microservicesDemo')).toBeHidden();
    expect(page.url()).toBe(url);
  });

  test('should keep the same case study when switching language', async ({ page }) => {
    // Arrange
    await page.goto('/?lang=en#architecture');
    await page.getByRole('tab', { name: 'E-Commerce Majestic' }).click();

    // Act
    await page.locator('#lang-toggle').click();

    // Assert
    const panel = page.locator('#case-eCommerceMajestic');
    await expect(panel).toBeVisible();
    await expect(panel.locator('h3')).toHaveText('E-Commerce Majestic — Go + Angular en AWS');
    await expect(panel.locator('[data-node="api"] .diagram__node-label')).toHaveText('API REST en Go');
  });
});
