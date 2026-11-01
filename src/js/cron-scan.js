// Scans a cron-shaped frequency forward from a last-done date to find the next occurrence,
// and (when a reference date is given) how many occurrences have been missed since then.
window.__cronScan = {
    // Safety cap on the day-by-day scan so an impossible combination of fields (e.g. a
    // day-of-month/month pair that never lines up) can't loop forever.
    MAX_SCAN_DAYS: 20 * 365,

    // The common case - a single plain step field such as "*/3" on day-of-month - keeps the
    // exact "N units after the anchor date" arithmetic it always had (so "every 3 days" is
    // always exactly 3 days later, regardless of which month that crosses). Anything richer
    // (lists, ranges, or more than one active field) is resolved by scanning the calendar
    // day by day for the next date that satisfies every active field at once.
    nextOccurrence(frequency, fromMs) {
        const fields = window.__cron.parseFields(frequency);
        if (window.__cron.isSimplePattern(fields)) {
            return window.__cron.nextDate(fromMs, frequency);
        }
        return this.nextOccurrenceGeneric(fields, fromMs);
    },

    nextOccurrenceGeneric(fields, fromMs) {
        const descriptors = {
            dayOfMonth: window.__cron.parseFieldValue(fields.dayOfMonth),
            month: window.__cron.parseFieldValue(fields.month),
            dayOfWeek: window.__cron.parseFieldValue(fields.dayOfWeek),
            year: window.__cron.parseFieldValue(fields.year),
        };

        const date = fromMs > 0 ? window.__date.getDate(fromMs) : window.__date.getDate();
        date.setDate(date.getDate() + 1);

        for (let i = 0; i < this.MAX_SCAN_DAYS; i++) {
            if (
                window.__cron.matchesField(descriptors.dayOfMonth, date.getDate(), 1) &&
                window.__cron.matchesField(descriptors.month, date.getMonth() + 1, 1) &&
                window.__cron.matchesField(descriptors.dayOfWeek, date.getDay(), 0) &&
                window.__cron.matchesField(descriptors.year, date.getFullYear(), 1970)
            ) {
                return date;
            }
            date.setDate(date.getDate() + 1);
        }
        return date;
    },

    // Walks the frequency forward from lastDone, counting how many occurrences have already
    // passed by referenceMs (defaulting to now). A brand new task (no lastDone yet) is simply
    // due today, with nothing overdue.
    scan(frequency, lastDoneMs, referenceMs) {
        const reference = referenceMs !== undefined ? window.__date.getDate(referenceMs) : window.__date.getDate();

        if (!lastDoneMs || lastDoneMs <= 0) {
            return { nextDate: window.__date.getDate(), overdueCount: 0 };
        }

        let next = this.nextOccurrence(frequency, lastDoneMs);
        let overdueCount = 0;
        while (next.getTime() < reference.getTime()) {
            overdueCount++;
            next = this.nextOccurrence(frequency, next.getTime());
        }
        return { nextDate: next, overdueCount };
    },
}
