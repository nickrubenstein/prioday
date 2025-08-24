// @ts-check
/// <reference path="./global.d.ts" />
const { test, expect } = require('@playwright/test');

test.describe('Prioday App', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display welcome message when no todos exist', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h3')).toContainText('Welcome to Prioday!');
    await expect(page.locator('p').first()).toContainText('Track recurring tasks');
    await expect(page.locator('.todo-container a[href="about.html"]')).toBeVisible();
  });

  test('should navigate to new todo page', async ({ page }) => {
    await page.goto('/');
    
    await page.click('[href="new.html"]');
    await expect(page.locator('h1 span').nth(1)).toContainText('New Todo');
    await expect(page.locator('input#text')).toBeVisible();
  });

  test('should create a new todo', async ({ page }) => {
    await page.goto('/new.html');
    
    // Fill out the form
    await page.fill('#text', 'Water the plants');
    await page.check('#repeat');
    // await page.click('#week');
    await page.fill('input[type="number"]', '2');
    
    // Submit the form
    await page.click('form button');
    
    // Should redirect to index and show the todo
    await expect(page).toHaveURL(/index\.html/);
    await expect(page.locator('.todo-text span').nth(0)).toContainText('Water the plants');
    await expect(page.locator('.todo-text span').nth(1)).toContainText('d2');
  });

  test('should mark todo as complete', async ({ page }) => {
    // Create a todo first
    await page.goto('/new.html');
    await page.fill('#text', 'Daily task');
    // await page.click('#day');
    await page.fill('input[type="number"]', '1');
    await page.click('form button');
    
    // Mark it as complete
    await page.click('.todo-check button');
    
    // Should have done styling
    await expect(page.locator('.todo-container')).toHaveClass(/todo-done/);
    await expect(page.locator('.todo-check button')).not.toBeVisible();
  });

  test('should navigate to settings', async ({ page }) => {
    await page.goto('/');
    
    await page.click('[href="settings.html"]');
    await expect(page.locator('h1 span').nth(1)).toContainText('Settings');
    await expect(page.locator('label[for="theme-dark"]')).toBeVisible();
    await expect(page.locator('#animation-form span')).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto('/settings.html');
    
    // Check initial theme (should be dark)
    await expect(page.locator('#theme-dark')).toBeChecked();
    
    // Switch to light theme
    await page.click('label[for="theme-light"]');
    
    // Check that theme changed
    const themeLink = page.locator('#theme-style');
    await expect(themeLink).toHaveAttribute('href', /light\.min\.css/);
  });

  test('should persist todos in localStorage', async ({ page }) => {
    // Create a todo
    await page.goto('/new.html');
    await page.fill('#text', 'Persistent task');
    await page.click('form button');
    
    // Reload page
    await page.reload();
    
    // Todo should still be there
    await expect(page.locator('.todo-text span').nth(0)).toContainText('Persistent task');
  });

  test('should navigate to todo details', async ({ page }) => {
    // Create a todo first
    await page.goto('/new.html');
    await page.fill('#text', 'Detail task');
    await page.click('form button');
    
    // Click on the todo text to go to details
    await page.click('.todo-text');
    
    // Should be on detail page
    await expect(page).toHaveURL(/detail\.html\?todoId=/);
    await expect(page.locator('input#text')).toHaveValue('Detail task');
  });
});