const THEME_KEY = 'theme';
const ANIMATION_KEY = 'animation';

class SettingsController {
    constructor() {
        this.theme = localStorage.getItem(THEME_KEY) || 'dark';
        this.animation = localStorage.getItem(ANIMATION_KEY) != 'false';
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
    }

    onAnimationChange() {
        localStorage.setItem(ANIMATION_KEY, this.animation);
    }

    onThemeChange() {
        localStorage.setItem(THEME_KEY, this.theme);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const settingsController = new SettingsController();
    settingsController.init();
});
