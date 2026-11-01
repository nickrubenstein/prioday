// Evaluator for todo recurrence, stored as a cron-shaped expression:
// "second minute hour day-of-month month day-of-week year"
window.__cron = {
    CRON_UNIT_NAMES: ['second', 'minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek', 'year'],

    SIMPLE_UNIT_FIELDS: {
        d: 'dayOfMonth',
        w: 'dayOfWeek',
        m: 'month',
        y: 'year',
    },

    LEGACY_FREQUENCY_PATTERN: /^[dwmy]\d+$/,

    // Bounds for the cron units a task's frequency can configure. Year has no fixed bound since
    // it isn't a real recurring calendar unit, so callers needing one (the builder UI) should ask
    // getFieldRange, which anchors it to the current year.
    FIELD_RANGES: {
        dayOfMonth: { min: 1, max: 31 },
        month: { min: 1, max: 12 },
        dayOfWeek: { min: 0, max: 6 },
    },

    FIELD_LABELS: {
        dayOfMonth: 'Day of month',
        month: 'Month',
        dayOfWeek: 'Day of week',
        year: 'Year',
    },

    // Short names for fields whose numeric values are better read as words. Index = the field's
    // numeric value (day-of-week runs 0-6, so no offset is needed; month runs 1-12, so index 0
    // is left unused).
    FIELD_VALUE_LABELS: {
        dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        month: [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },

    getFieldRange(fieldName) {
        if (fieldName === 'year') {
            const currentYear = new Date().getFullYear();
            return { min: currentYear, max: currentYear + 50 };
        }
        return this.FIELD_RANGES[fieldName];
    },

    isLegacyFrequency(frequency) {
        return typeof frequency === 'string' && this.LEGACY_FREQUENCY_PATTERN.test(frequency);
    },

    parseFields(cronString) {
        const values = (cronString || '').trim().split(/\s+/);
        const fields = {};
        this.CRON_UNIT_NAMES.forEach((name, i) => {
            fields[name] = values[i] !== undefined ? values[i] : '*';
        });
        return fields;
    },

    formatFields(fields) {
        return this.CRON_UNIT_NAMES.map(name => fields[name] ?? '*').join(' ');
    },

    // Parses a single field's raw value into a rule descriptor: a wildcard ("*"), a step
    // ("*/n"), a range ("a-b"), a list ("a,b,c"), or a single value (treated as a one-item list).
    parseFieldValue(value) {
        if (!value || value === '*') {
            return { type: 'wildcard' };
        }
        if (value.startsWith('*/')) {
            return { type: 'step', step: +value.slice(2) };
        }
        if (value.includes('-')) {
            const [min, max] = value.split('-').map(Number);
            return { type: 'range', min, max };
        }
        if (value.includes(',')) {
            return { type: 'list', values: value.split(',').map(Number) };
        }
        const single = Number(value);
        if (!Number.isNaN(single)) {
            return { type: 'list', values: [single] };
        }
        return { type: 'wildcard' };
    },

    // Inverse of parseFieldValue: turns a rule descriptor back into its cron field string.
    formatFieldValue(descriptor) {
        switch (descriptor.type) {
            case 'step': return `*/${descriptor.step}`;
            case 'range': return `${descriptor.min}-${descriptor.max}`;
            case 'list': return descriptor.values.join(',');
            default: return '*';
        }
    },

    // Does a single calendar value satisfy a field's rule descriptor? fieldMin anchors step
    // matching (e.g. day-of-month steps from 1, day-of-week steps from 0).
    matchesField(descriptor, value, fieldMin) {
        switch (descriptor.type) {
            case 'wildcard': return true;
            case 'list': return descriptor.values.includes(value);
            case 'range': return value >= descriptor.min && value <= descriptor.max;
            case 'step': return ((value - fieldMin) % descriptor.step) === 0;
            default: return true;
        }
    },

    // A frequency is "simple" when exactly one of the four calendar fields is active and that
    // field is a plain step (the only shape the old single-unit/count UI could ever produce).
    // cron-scan.js uses this to keep the original "N units after last done" arithmetic for the
    // common case, falling back to calendar field-matching only for lists/ranges/combinations.
    isSimplePattern(fields) {
        const active = Object.values(this.SIMPLE_UNIT_FIELDS).filter(name => fields[name] && fields[name] !== '*');
        if (active.length !== 1) {
            return false;
        }
        return this.parseFieldValue(fields[active[0]]).type === 'step';
    },

    formatFieldValueLabel(fieldName, value) {
        const labels = this.FIELD_VALUE_LABELS[fieldName];
        return labels ? labels[value] : value;
    },

    // Human-readable description of a frequency. Simple single-unit/count patterns keep their
    // original "3 days" wording; anything with lists, ranges, or multiple active fields gets a
    // generic description built field by field.
    frequencyDescription(frequency) {
        const fields = this.parseFields(frequency);
        if (this.isSimplePattern(fields)) {
            return this.frequencyDisplay(frequency);
        }
        const parts = [];
        for (const name of ['dayOfMonth', 'month', 'dayOfWeek', 'year']) {
            const descriptor = this.parseFieldValue(fields[name]);
            const label = this.FIELD_LABELS[name];
            switch (descriptor.type) {
                case 'step': parts.push(`Every ${descriptor.step} ${label}(s)`); break;
                case 'range':
                    parts.push(`${label} ${this.formatFieldValueLabel(name, descriptor.min)}-${this.formatFieldValueLabel(name, descriptor.max)}`);
                    break;
                case 'list':
                    parts.push(`${label} ${descriptor.values.map(v => this.formatFieldValueLabel(name, v)).join(', ')}`);
                    break;
                default: break;
            }
        }
        return parts.length ? parts.join(', ') : 'Every day';
    },

    formatFrequency(unit, count) {
        const n = Math.trunc(+count) || 1;
        const field = this.SIMPLE_UNIT_FIELDS[unit] || this.SIMPLE_UNIT_FIELDS.d;
        const fields = { second: '0', minute: '0', hour: '0', dayOfMonth: '*', month: '*', dayOfWeek: '*', year: '*' };
        fields[field] = `*/${n}`;
        return this.formatFields(fields);
    },

    parseFrequency(frequency) {
        if (this.isLegacyFrequency(frequency)) {
            frequency = this.migrateFrequency(frequency);
        }
        const fields = this.parseFields(frequency);
        for (const unit of Object.keys(this.SIMPLE_UNIT_FIELDS)) {
            const parsed = this.parseFieldValue(fields[this.SIMPLE_UNIT_FIELDS[unit]]);
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
        return 'Every ' + display;
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
