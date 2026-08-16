window.__settings = {
    THEME_KEY: 'theme',
    ANIMATION_KEY: 'animation',
    ACCENT_KEY: 'accent',
    TINT_KEY: 'accentTint',
    theme: localStorage.getItem('theme') || 'dark',
    animation: localStorage.getItem('animation') != 'false',
    accent: localStorage.getItem('accent') || '#3b82f6',
    tint: getStoredTint(),
    // Must match the :root values in css/themes/dark.css and css/themes/light.css —
    // used to compute the tinted override colors without waiting on stylesheet load.
    THEME_BASE_COLORS: {
        dark: {
            '--background-body': [20, 20, 20],
            '--background-alt': [30, 30, 30],
            '--background': [40, 40, 40],
            '--selection': [90, 90, 90],
        },
        light: {
            '--background-body': [200, 200, 200],
            '--background-alt': [150, 150, 150],
            '--background': [240, 240, 240],
            '--selection': [95, 95, 95],
        }
    },
    applyTheme() {
        const themeLink = document.getElementById('theme-style');
        if (!themeLink) return;
        let href;
        this.theme = localStorage.getItem(window.__settings.THEME_KEY) || 'dark';
        switch (this.theme) {
            case 'light':
                href = 'css/themes/light.css';
                break;
            default:
                href = 'css/themes/dark.css';
        }
        themeLink.href = href + '?v=2.0.0';
    },
    applyAccent() {
        this.accent = localStorage.getItem(window.__settings.ACCENT_KEY) || '#3b82f6';
        const root = document.documentElement;
        const baseColors = this.THEME_BASE_COLORS[this.theme] || this.THEME_BASE_COLORS.dark;
        const varNames = Object.keys(baseColors);

        if (this.accent === 'default') {
            varNames.forEach(name => root.style.removeProperty(name));
            return;
        }

        const accentRgb = hexToRgb(this.accent);
        if (!accentRgb) return;

        this.tint = getStoredTint();

        varNames.forEach(name => {
            // Selection is a full accent surface; backgrounds get a light tint so the theme stays dark/light.
            const ratio = name === '--selection' ? 1 : (this.tint / 100);
            const base = baseColors[name];
            const mixed = base.map((channel, i) => Math.round(channel * (1 - ratio) + accentRgb[i] * ratio));
            root.style.setProperty(name, `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`);
        });
    }
}

function hexToRgb(hex) {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return match ? [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)] : null;
}

function getStoredTint() {
    const parsed = parseInt(localStorage.getItem('accentTint'), 10);
    return isNaN(parsed) ? 12 : parsed;
}

window.__settings.applyTheme();
window.__settings.applyAccent();
