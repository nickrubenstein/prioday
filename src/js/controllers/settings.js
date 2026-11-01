class SettingsController {
    constructor() {
        this.theme = localStorage.getItem(window.__settings.THEME_KEY) || 'dark';
        this.animation = localStorage.getItem(window.__settings.ANIMATION_KEY) != 'false';
        this.accent = localStorage.getItem(window.__settings.ACCENT_KEY) || '#3b82f6';
        const parsedTint = parseInt(localStorage.getItem(window.__settings.TINT_KEY), 10);
        this.tint = isNaN(parsedTint) ? 12 : parsedTint;
    }

    init() {
        // Set initial values in form
        const themeRadio = document.querySelector(`input[name="theme"][value="${this.theme}"]`);
        if (themeRadio) {
            themeRadio.checked = true;
        }

        const animationCheckbox = document.getElementById('animation');
        if (animationCheckbox) {
            animationCheckbox.checked = this.animation;
        }

        const accentSelect = document.getElementById('accent-color');
        if (accentSelect) {
            accentSelect.value = this.accent;
        }

        const tintSlider = document.getElementById('tint-strength');
        const tintValueLabel = document.getElementById('tint-strength-value');
        if (tintSlider) {
            tintSlider.value = this.tint;
            updateRangeProgress(tintSlider);
        }
        if (tintValueLabel) {
            tintValueLabel.textContent = `${this.tint}%`;
        }

        // Add event listeners
        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.theme = e.target.value;
                this.onThemeChange();
            });
        });

        if (animationCheckbox) {
            animationCheckbox.addEventListener('change', (e) => {
                this.animation = e.target.checked;
                this.onAnimationChange();
            });
        }

        if (accentSelect) {
            accentSelect.addEventListener('change', (e) => {
                this.accent = e.target.value;
                this.onAccentChange();
            });
        }

        if (tintSlider) {
            tintSlider.addEventListener('input', (e) => {
                this.tint = parseInt(e.target.value, 10);
                updateRangeProgress(e.target);
                if (tintValueLabel) {
                    tintValueLabel.textContent = `${this.tint}%`;
                }
                this.onTintChange();
            });
        }
    }

    onAnimationChange() {
        localStorage.setItem(window.__settings.ANIMATION_KEY, this.animation);
        window.__settings.animation = this.animation;
    }

    onThemeChange() {
        localStorage.setItem(window.__settings.THEME_KEY, this.theme);
        window.__settings.applyTheme();
        window.__settings.applyAccent();
    }

    onAccentChange() {
        localStorage.setItem(window.__settings.ACCENT_KEY, this.accent);
        window.__settings.applyAccent();
    }

    onTintChange() {
        localStorage.setItem(window.__settings.TINT_KEY, this.tint);
        window.__settings.applyAccent();
    }
}

// Drives the --range-progress custom property the WebKit/Blink track gradient reads,
// since those engines have no native ::-moz-range-progress equivalent.
function updateRangeProgress(rangeEl) {
    const min = parseFloat(rangeEl.min) || 0;
    const max = parseFloat(rangeEl.max) || 100;
    const value = parseFloat(rangeEl.value);
    const percent = ((value - min) / (max - min)) * 100;
    rangeEl.style.setProperty('--range-progress', `${percent}%`);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const settingsController = new SettingsController();
    settingsController.init();
});
