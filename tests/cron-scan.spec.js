// @ts-check
/// <reference path="./global.d.ts" />
const { test, expect } = require('@playwright/test');

test.describe('Cron Scanner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.__cronScan);
  });

  test('should keep a day-of-month step as an exact N-day offset across a month boundary', async ({ page }) => {
    const result = await page.evaluate(() => {
      const lastDone = new Date(2026, 0, 30).getTime(); // Jan 30, 2026
      return window.__cronScan.nextOccurrence('0 0 0 */3 * * *', lastDone).getTime();
    });
    const expected = new Date(2026, 1, 2).getTime(); // Feb 2, 2026 - still exactly 3 days later
    expect(result).toBe(expected);
  });

  test('should give a brand new task (no lastDone) a next date of today with nothing overdue', async ({ page }) => {
    const result = await page.evaluate(() => {
      const { nextDate, overdueCount } = window.__cronScan.scan('0 0 0 */3 * * *', 0);
      return { nextDate: nextDate.getTime(), overdueCount, today: window.__date.getDate().getTime() };
    });
    expect(result.nextDate).toBe(result.today);
    expect(result.overdueCount).toBe(0);
  });

  test('should report zero overdue when the next occurrence has not arrived yet', async ({ page }) => {
    const result = await page.evaluate(() => {
      const reference = new Date(2026, 5, 15).getTime();
      const lastDone = new Date(2026, 5, 14).getTime();
      return window.__cronScan.scan('0 0 0 */3 * * *', lastDone, reference).overdueCount;
    });
    expect(result).toBe(0);
  });

  test('should count every missed occurrence and land on the next upcoming one', async ({ page }) => {
    const result = await page.evaluate(() => {
      const reference = new Date(2026, 5, 15).getTime();
      const lastDone = new Date(2026, 5, 5).getTime(); // 10 days before reference, every 3 days
      const { nextDate, overdueCount } = window.__cronScan.scan('0 0 0 */3 * * *', lastDone, reference);
      return { nextDate: nextDate.getTime(), overdueCount };
    });
    // Occurrences land on Jun 8, 11, 14 (all before the Jun 15 reference - 3 missed) and Jun 17 (next up).
    expect(result.overdueCount).toBe(3);
    expect(result.nextDate).toBe(new Date(2026, 5, 17).getTime());
  });

  test('should AND multiple active fields together for combined patterns (every Monday in June)', async ({ page }) => {
    const result = await page.evaluate(() => {
      const frequency = window.__cron.formatFields({
        second: '0', minute: '0', hour: '0',
        dayOfMonth: '*', month: '6', dayOfWeek: '1', year: '*',
      });
      const lastDone = new Date(2026, 5, 2).getTime(); // Tuesday Jun 2, 2026
      return window.__cronScan.nextOccurrence(frequency, lastDone).getTime();
    });
    // Jun 1, 2026 is a Monday, so the next Monday after Jun 2 is Jun 8.
    expect(result).toBe(new Date(2026, 5, 8).getTime());
  });

  test('should skip years outside a combined year range', async ({ page }) => {
    const result = await page.evaluate(() => {
      const frequency = window.__cron.formatFields({
        second: '0', minute: '0', hour: '0',
        dayOfMonth: '1', month: '1', dayOfWeek: '*', year: '2028-2030',
      });
      const lastDone = new Date(2026, 0, 1).getTime();
      return window.__cronScan.nextOccurrence(frequency, lastDone).getTime();
    });
    expect(result).toBe(new Date(2028, 0, 1).getTime());
  });
});
