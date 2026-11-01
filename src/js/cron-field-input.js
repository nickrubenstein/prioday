// Reusable input for a single cron unit (day-of-month, month, day-of-week, or year). Lets the
// user pick one of: any value, a comma list, a dash range, or a "*/n" step, and exposes the
// result as the plain cron field string - never raw string typing.
//
// Pass valueLabels (an array indexed by the field's numeric value, e.g. day-of-week's
// ['Sun', 'Mon', ...]) to show short names instead of raw numbers for List/Range modes.
class CronFieldInput {
    constructor(container, config) {
        this.container = container;
        this.name = config.name;
        this.label = config.label;
        this.min = config.min;
        this.max = config.max;
        this.hint = config.hint || '';
        this.valueLabels = config.valueLabels || null;
        this.hasLabels = Array.isArray(this.valueLabels);
        this.onChange = config.onChange || (() => {});
        this.mode = 'wildcard';

        this.render();
    }

    renderListDetail() {
        if (!this.hasLabels) {
            return `<input type="text" id="${this.name}-list"
                placeholder="e.g. ${this.min},${this.min + 1},${this.max}">`;
        }
        let options = '';
        for (let v = this.min; v <= this.max; v++) {
            options += `
                <input type="checkbox" id="${this.name}-list-${v}" value="${v}">
                <label for="${this.name}-list-${v}">${this.valueLabels[v]}</label>
            `;
        }
        return `<div class="cron-field-checkbox-group">${options}</div>`;
    }

    renderRangeDetail() {
        if (!this.hasLabels) {
            return `
                <input type="number" id="${this.name}-range-min" min="${this.min}" max="${this.max}" placeholder="From">
                <input type="number" id="${this.name}-range-max" min="${this.min}" max="${this.max}" placeholder="To">
            `;
        }
        let options = '';
        for (let v = this.min; v <= this.max; v++) {
            options += `<option value="${v}">${this.valueLabels[v]}</option>`;
        }
        return `
            <select id="${this.name}-range-min">${options}</select>
            <select id="${this.name}-range-max">${options}</select>
        `;
    }

    render() {
        this.container.innerHTML = `
            <label class="cron-field-label">${this.label}</label>
            <div class="radio-group cron-mode-group">
                <input type="radio" id="${this.name}-mode-wildcard" name="${this.name}-mode" value="wildcard" checked>
                <label for="${this.name}-mode-wildcard">All</label>

                <input type="radio" id="${this.name}-mode-step" name="${this.name}-mode" value="step">
                <label for="${this.name}-mode-step">Every</label>

                <input type="radio" id="${this.name}-mode-list" name="${this.name}-mode" value="list">
                <label for="${this.name}-mode-list">List</label>

                <input type="radio" id="${this.name}-mode-range" name="${this.name}-mode" value="range">
                <label for="${this.name}-mode-range">Range</label>
            </div>
            <div class="cron-field-detail">
                <div class="cron-field-list" style="display:none;">${this.renderListDetail()}</div>
                <div class="cron-field-range" style="display:none;">${this.renderRangeDetail()}</div>
                <input class="cron-field-step" type="number" id="${this.name}-step" min="1" placeholder="Every N" style="display:none;">
            </div>
            ${this.hint ? `<small class="cron-field-hint">${this.hint}</small>` : ''}
        `;

        this.cacheElements();
        this.attachListeners();
        this.updateVisibility();
    }

    cacheElements() {
        this.modeRadios = this.container.querySelectorAll(`input[name="${this.name}-mode"]`);
        this.listContainer = this.container.querySelector('.cron-field-list');
        this.listInput = this.container.querySelector(`#${this.name}-list`);
        this.listCheckboxes = this.container.querySelectorAll('.cron-field-list input[type="checkbox"]');
        this.rangeContainer = this.container.querySelector('.cron-field-range');
        this.rangeMinInput = this.container.querySelector(`#${this.name}-range-min`);
        this.rangeMaxInput = this.container.querySelector(`#${this.name}-range-max`);
        this.stepInput = this.container.querySelector(`#${this.name}-step`);
    }

    attachListeners() {
        this.modeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (!e.target.checked) {
                    return;
                }
                this.mode = e.target.value;
                this.updateVisibility();
                this.onChange(this.getValue());
            });
        });

        const inputs = [this.rangeMinInput, this.rangeMaxInput, this.stepInput];
        if (this.listInput) {
            inputs.push(this.listInput);
        }
        inputs.forEach(input => {
            input.addEventListener('input', () => this.onChange(this.getValue()));
        });

        this.listCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.onChange(this.getValue()));
        });
    }

    updateVisibility() {
        this.listContainer.style.display = this.mode === 'list' ? '' : 'none';
        this.rangeContainer.style.display = this.mode === 'range' ? '' : 'none';
        this.stepInput.style.display = this.mode === 'step' ? '' : 'none';
    }

    // Returns the cron field string ("*", "1,15,20", "1-5", or "*/3") for the current mode.
    getValue() {
        switch (this.mode) {
            case 'list': {
                const values = this.hasLabels
                    ? Array.from(this.listCheckboxes).filter(cb => cb.checked).map(cb => parseInt(cb.value, 10))
                    : this.listInput.value.split(',').map(v => parseInt(v.trim(), 10)).filter(v => !Number.isNaN(v));
                if (values.length === 0) {
                    return '*';
                }
                return window.__cron.formatFieldValue({ type: 'list', values });
            }
            case 'range': {
                const min = parseInt(this.rangeMinInput.value, 10);
                const max = parseInt(this.rangeMaxInput.value, 10);
                if (Number.isNaN(min) || Number.isNaN(max)) {
                    return '*';
                }
                return window.__cron.formatFieldValue({ type: 'range', min, max });
            }
            case 'step': {
                const step = parseInt(this.stepInput.value, 10);
                if (Number.isNaN(step) || step < 1) {
                    return '*';
                }
                return window.__cron.formatFieldValue({ type: 'step', step });
            }
            default:
                return '*';
        }
    }

    // Populates the control from an existing cron field string (e.g. when editing a todo).
    setValue(value) {
        const descriptor = window.__cron.parseFieldValue(value);
        this.mode = descriptor.type;

        switch (descriptor.type) {
            case 'list':
                if (this.hasLabels) {
                    this.listCheckboxes.forEach(cb => {
                        cb.checked = descriptor.values.includes(parseInt(cb.value, 10));
                    });
                } else {
                    this.listInput.value = descriptor.values.join(',');
                }
                break;
            case 'range':
                this.rangeMinInput.value = descriptor.min;
                this.rangeMaxInput.value = descriptor.max;
                break;
            case 'step':
                this.stepInput.value = descriptor.step;
                break;
            default:
                break;
        }

        const radio = this.container.querySelector(`input[name="${this.name}-mode"][value="${this.mode}"]`);
        if (radio) {
            radio.checked = true;
        }
        this.updateVisibility();
    }
}

window.CronFieldInput = CronFieldInput;
