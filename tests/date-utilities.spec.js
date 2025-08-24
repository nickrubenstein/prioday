// @ts-check
/// <reference path="./global.d.ts" />
const { test, expect } = require('@playwright/test');

test.describe('Date Utilities', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Access the window.__date object
    await page.waitForFunction(() => window.__date);
  });

  test('should format today date correctly', async ({ page }) => {
    const today = await page.evaluate(() => window.__date.today);
    
    // Should be in MM/DD/YY format
    expect(today).toMatch(/\d{2}\/\d{2}\/\d{2}/);
  });

  test('should get date string for today', async ({ page }) => {
    const todayString = await page.evaluate(() => {
      const date = window.__date.getDate();
      return window.__date.getDateString(date);
    });
    
    expect(todayString).toBe('Today');
  });

  test('should get date string for yesterday', async ({ page }) => {
    const yesterdayString = await page.evaluate(() => {
      const yesterday = new Date();
      yesterday.setHours(0,0,0,0);
      yesterday.setDate(yesterday.getDate() - 1);
      return window.__date.getDateString(yesterday);
    });
    
    expect(yesterdayString).toBe('Yesterday');
  });

  test('should get date string for tomorrow', async ({ page }) => {
    const tomorrowString = await page.evaluate(() => {
      const tomorrow = new Date();
      tomorrow.setHours(0,0,0,0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return window.__date.getDateString(tomorrow);
    });
    
    expect(tomorrowString).toBe('Tomorrow');
  });

  test('should handle new todo date', async ({ page }) => {
    const newString = await page.evaluate(() => {
      const newDate = new Date(-64800000); // Special "new" date
      return window.__date.getDateString(newDate);
    });
    
    expect(newString).toBe('New');
  });

  test('should calculate next date for daily frequency', async ({ page }) => {
    const nextDate = await page.evaluate(() => {
      const lastDone = Date.now();
      return window.__date.nextDate(lastDone, 'd3');
    });
    
    const today = new Date();
    const expected = new Date(today);
    expected.setDate(expected.getDate() + 3);
    expected.setHours(0, 0, 0, 0);
    
    expect(new Date(nextDate).getDate()).toBe(expected.getDate());
  });

  test('should calculate next date for weekly frequency', async ({ page }) => {
    const nextDate = await page.evaluate(() => {
      const lastDone = Date.now();
      return window.__date.nextDate(lastDone, 'w2');
    });
    
    const today = new Date();
    const expected = new Date(today);
    expected.setDate(expected.getDate() + 14); // 2 weeks
    expected.setHours(0, 0, 0, 0);
    
    expect(new Date(nextDate).getDate()).toBe(expected.getDate());
  });

  test('should get days ago string', async ({ page }) => {
    const daysAgo = await page.evaluate(() => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const today = new Date();
      return window.__date.getDaysAgoString(threeDaysAgo, today, false);
    });
    
    expect(daysAgo).toBe('3 days ago');
  });

  test('should get days in future string', async ({ page }) => {
    const daysInFuture = await page.evaluate(() => {
      const today = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      return window.__date.getDaysAgoString(today, threeDaysFromNow, true);
    });
    
    expect(daysInFuture).toBe('in 3 days');
  });
});