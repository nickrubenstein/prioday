// @ts-check
/// <reference path="./global.d.ts" />
const { test, expect } = require('@playwright/test');

test.describe('Cron Evaluator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.__cron);
  });

  test('should calculate next date for daily frequency', async ({ page }) => {
    const nextDate = await page.evaluate(() => {
      const lastDone = Date.now();
      return window.__cron.nextDate(lastDone, '0 0 0 */3 * * *');
    });

    const today = new Date();
    const expected = new Date(today);
    expected.setDate(expected.getDate() + 3);
    expected.setHours(0, 0, 0, 0);

    expect(new Date(nextDate).getTime()).toBe(expected.getTime());
  });

  test('should calculate next date for weekly frequency', async ({ page }) => {
    const nextDate = await page.evaluate(() => {
      const lastDone = Date.now();
      return window.__cron.nextDate(lastDone, '0 0 0 * * */2 *');
    });

    const today = new Date();
    const expected = new Date(today);
    expected.setDate(expected.getDate() + 14); // 2 weeks
    expected.setHours(0, 0, 0, 0);

    expect(new Date(nextDate).getTime()).toBe(expected.getTime());
  });

  test('should calculate next date for monthly frequency', async ({ page }) => {
    const nextDate = await page.evaluate(() => {
      const lastDone = Date.now();
      return window.__cron.nextDate(lastDone, '0 0 0 * */2 * *');
    });

    const today = new Date();
    const expected = new Date(today);
    expected.setMonth(expected.getMonth() + 2);
    expected.setHours(0, 0, 0, 0);

    expect(new Date(nextDate).getTime()).toBe(expected.getTime());
  });

  test('should calculate next date for yearly frequency', async ({ page }) => {
    const nextDate = await page.evaluate(() => {
      const lastDone = Date.now();
      return window.__cron.nextDate(lastDone, '0 0 0 * * * */1');
    });

    const today = new Date();
    const expected = new Date(today);
    expected.setFullYear(expected.getFullYear() + 1);
    expected.setHours(0, 0, 0, 0);

    expect(new Date(nextDate).getTime()).toBe(expected.getTime());
  });

  test('should still calculate next date from legacy frequency strings', async ({ page }) => {
    const nextDate = await page.evaluate(() => {
      const lastDone = Date.now();
      return window.__cron.nextDate(lastDone, 'd3');
    });

    const today = new Date();
    const expected = new Date(today);
    expected.setDate(expected.getDate() + 3);
    expected.setHours(0, 0, 0, 0);

    expect(new Date(nextDate).getTime()).toBe(expected.getTime());
  });

  test('should format frequency as a cron expression with zeroed second/minute/hour', async ({ page }) => {
    const results = await page.evaluate(() => ({
      day: window.__cron.formatFrequency('d', 1),
      week: window.__cron.formatFrequency('w', 2),
      month: window.__cron.formatFrequency('m', 3),
      year: window.__cron.formatFrequency('y', 4),
    }));

    expect(results.day).toBe('0 0 0 */1 * * *');
    expect(results.week).toBe('0 0 0 * * */2 *');
    expect(results.month).toBe('0 0 0 * */3 * *');
    expect(results.year).toBe('0 0 0 * * * */4');
  });

  test('should parse cron frequency expressions back into unit/count', async ({ page }) => {
    const results = await page.evaluate(() => ({
      day: window.__cron.parseFrequency('0 0 0 */1 * * *'),
      week: window.__cron.parseFrequency('0 0 0 * * */2 *'),
      month: window.__cron.parseFrequency('0 0 0 * */3 * *'),
      year: window.__cron.parseFrequency('0 0 0 * * * */4'),
    }));

    expect(results.day).toEqual({ unit: 'd', count: 1 });
    expect(results.week).toEqual({ unit: 'w', count: 2 });
    expect(results.month).toEqual({ unit: 'm', count: 3 });
    expect(results.year).toEqual({ unit: 'y', count: 4 });
  });

  test('should identify and migrate legacy frequency strings to cron expressions', async ({ page }) => {
    const results = await page.evaluate(() => ({
      isLegacyOld: window.__cron.isLegacyFrequency('d3'),
      isLegacyNew: window.__cron.isLegacyFrequency('0 0 0 */3 * * *'),
      day: window.__cron.migrateFrequency('d3'),
      week: window.__cron.migrateFrequency('w2'),
      month: window.__cron.migrateFrequency('m5'),
      year: window.__cron.migrateFrequency('y1'),
      alreadyMigrated: window.__cron.migrateFrequency('0 0 0 */3 * * *'),
    }));

    expect(results.isLegacyOld).toBe(true);
    expect(results.isLegacyNew).toBe(false);
    expect(results.day).toBe('0 0 0 */3 * * *');
    expect(results.week).toBe('0 0 0 * * */2 *');
    expect(results.month).toBe('0 0 0 * */5 * *');
    expect(results.year).toBe('0 0 0 * * * */1');
    expect(results.alreadyMigrated).toBe('0 0 0 */3 * * *');
  });

  test('should produce a human readable frequency display', async ({ page }) => {
    const results = await page.evaluate(() => ({
      day: window.__cron.frequencyDisplay('0 0 0 */1 * * *'),
      days: window.__cron.frequencyDisplay('0 0 0 */3 * * *'),
      week: window.__cron.frequencyDisplay('0 0 0 * * */1 *'),
      weeks: window.__cron.frequencyDisplay('0 0 0 * * */2 *'),
      month: window.__cron.frequencyDisplay('0 0 0 * */1 * *'),
      year: window.__cron.frequencyDisplay('0 0 0 * * * */1'),
    }));

    expect(results.day).toBe('1 day');
    expect(results.days).toBe('3 days');
    expect(results.week).toBe('1 week');
    expect(results.weeks).toBe('2 weeks');
    expect(results.month).toBe('1 month');
    expect(results.year).toBe('1 year');
  });

  // Regression coverage for the old encoding, where a yearly frequency had to piggyback on the
  // month field (day-of-month set to "1" as a marker) since there was no dedicated year field.
  // That collided with any future rule that wanted day-of-month to carry its own real meaning.
  test('should give year its own cron field, independent of day-of-month and month', async ({ page }) => {
    const results = await page.evaluate(() => {
      const yearFrequency = window.__cron.formatFrequency('y', 2);
      const monthFrequency = window.__cron.formatFrequency('m', 2);
      return {
        yearFrequency,
        yearFields: window.__cron.parseFields(yearFrequency),
        monthFields: window.__cron.parseFields(monthFrequency),
      };
    });

    // Year frequency leaves day-of-month and month untouched...
    expect(results.yearFields.dayOfMonth).toBe('*');
    expect(results.yearFields.month).toBe('*');
    expect(results.yearFields.year).toBe('*/2');

    // ...and month frequency leaves day-of-month and year untouched, so a future rule can use
    // day-of-month for its own purpose without conflicting with either.
    expect(results.monthFields.dayOfMonth).toBe('*');
    expect(results.monthFields.month).toBe('*/2');
    expect(results.monthFields.year).toBe('*');
  });

  test('should round-trip every unit through format -> parse without collisions', async ({ page }) => {
    const results = await page.evaluate(() => {
      const units = ['d', 'w', 'm', 'y'];
      return units.map(unit => {
        const frequency = window.__cron.formatFrequency(unit, 5);
        return { unit, frequency, parsed: window.__cron.parseFrequency(frequency) };
      });
    });

    for (const { unit, parsed } of results) {
      expect(parsed).toEqual({ unit, count: 5 });
    }
  });
});
