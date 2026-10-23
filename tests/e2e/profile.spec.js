import { test, expect } from '@playwright/test';

test.describe('profile page', () => {
  test('should show hero and sections in order when opening the site', async ({ page }) => {
    // Arrange / Act
    await page.goto('/?lang=en');

    // Assert
    await expect(page.locator('#hero h1')).toHaveText('Harlin Acero');
    await expect(page.locator('#hero .hero__headline')).toHaveText('Software Engineer & Software Architect');
    await expect(page.locator('#hero .hero__actions a')).toHaveText(['See projects', 'Contact me', 'Download CV']);
    const ids = await page.locator('main > section').evaluateAll((sections) => sections.map((s) => s.id));
    expect(ids).toEqual(['hero', 'leadership', 'about', 'architecture', 'experience', 'skills', 'projects', 'education', 'certifications', 'languages', 'contact']);
  });

  test('should scroll to projects when clicking the menu entry', async ({ page }) => {
    // Arrange
    await page.goto('/?lang=en');

    // Act
    await page.getByRole('navigation').getByRole('link', { name: 'Projects' }).click();

    // Assert
    await expect(page.locator('#projects h2')).toBeInViewport();
    await expect(page).toHaveURL(/#projects$/);
  });

  test('should open positioned on the section when the link has a hash', async ({ page }) => {
    // Arrange / Act
    await page.goto('/?lang=es#experience');

    // Assert
    await expect(page.locator('#experience h2')).toHaveText('Experiencia');
    await expect(page.locator('#experience h2')).toBeInViewport();
  });

  test('should open the case study when the link points to it', async ({ page }) => {
    // Arrange / Act
    await page.goto('/?lang=en#case-employeeAttendanceControl');

    // Assert
    await expect(page.locator('#case-employeeAttendanceControl')).toBeVisible();
    await expect(page.locator('#case-microservicesDemo')).toBeHidden();
  });
});
