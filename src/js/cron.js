// Evaluator for todo recurrence, stored as a cron-shaped expression:
// "second minute hour day-of-month month day-of-week year"
window.__cron = {
    FIELD_NAMES: ['second', 'minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek', 'year'],

    UNIT_FIELDS: {
        d: 'dayOfMonth',
        w: 'dayOfWeek',
        m: 'month',
        y: 'year',
    },

    LEGACY_FREQUENCY_PATTERN: /^[dwmy]\d+$/,

    isLegacyFrequency(frequency) {
        return typeof frequency === 'string' && this.LEGACY_FREQUENCY_PATTERN.test(frequency);
    },

    parseFields(cronString) {
        const values = (cronString || '').trim().split(/\s+/);
        const fields = {};
        this.FIELD_NAMES.forEach((name, i) => {
            fields[name] = values[i] !== undefined ? values[i] : '*';
        });
        return fields;
    },

    formatFields(fields) {
        return this.FIELD_NAMES.map(name => fields[name] ?? '*').join(' ');
    },

    // Parses a single field's raw value into a rule descriptor. Only step values exist today;
    // future rules (lists like "1,15", ranges like "1-5", specific values) get new branches here.
    parseFieldValue(value) {
        if (value && value.startsWith('*/')) {
            return { type: 'step', step: +value.slice(2) };
        }
        return { type: 'wildcard' };
    },

    formatFrequency(unit, count) {
        const n = Math.trunc(+count) || 1;
        const field = this.UNIT_FIELDS[unit] || this.UNIT_FIELDS.d;
        const fields = { second: '0', minute: '0', hour: '0', dayOfMonth: '*', month: '*', dayOfWeek: '*', year: '*' };
        fields[field] = `*/${n}`;
        return this.formatFields(fields);
    },

    parseFrequency(frequency) {
        if (this.isLegacyFrequency(frequency)) {
            frequency = this.migrateFrequency(frequency);
        }
        const fields = this.parseFields(frequency);
        for (const unit of Object.keys(this.UNIT_FIELDS)) {
            const parsed = this.parseFieldValue(fields[this.UNIT_FIELDS[unit]]);
            if (parsed.type === 'step') {
                return { unit, count: parsed.step };
            }
        }
        return { unit: 'd', count: 1 };
    },

    migrateFrequency(frequency) {
        if (!this.isLegacyFrequency(frequency)) {
            return frequency;
        }
        return this.formatFrequency(frequency[0], frequency.substring(1));
    },

    frequencyDisplay(frequency) {
        const { unit, count } = this.parseFrequency(frequency);
        let display = '' + count;
        switch (unit) {
            case 'd': display += ' day'; break;
            case 'w': display += ' week'; break;
            case 'm': display += ' month'; break;
            case 'y': display += ' year'; break;
            default: break;
        }
        if (count > 1) {
            display += 's';
        }
        return display;
    },

    nextDate(lastDone, frequency) {
        const date = lastDone > 0 ? window.__date.getDate(lastDone) : window.__date.getDate();
        const { unit, count } = this.parseFrequency(frequency);
        switch (unit) {
            case 'd': date.setDate(date.getDate() + count); break;
            case 'w': date.setDate(date.getDate() + (7 * count)); break;
            case 'm': date.setMonth(date.getMonth() + count); break;
            case 'y': date.setFullYear(date.getFullYear() + count); break;
        }
        return date;
    },
}
