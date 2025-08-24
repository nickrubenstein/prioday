const THEME_KEY = 'theme';
const ANIMATION_KEY = 'animation';
window.__settings = {
    theme: localStorage.getItem(THEME_KEY) || 'dark',
    animation: localStorage.getItem(ANIMATION_KEY) != 'false',

    onAnimationChange() {
        localStorage.setItem(ANIMATION_KEY, this.animation);
    },
    onThemeChange() {
        localStorage.setItem(THEME_KEY, this.theme);
        this.applyTheme();
    },
    applyTheme() {
        const themeLink = document.getElementById('theme-style');
        if (!themeLink) return;
        let href;
        switch (this.theme) {
            case 'light':
                href = 'https://cdn.jsdelivr.net/npm/water.css@2/out/light.min.css';
                break;
            default:
                href = 'https://cdn.jsdelivr.net/npm/water.css@2/out/dark.min.css';
        }
        themeLink.href = href + '?v=1.0.0';
    },
    init() {
        this.applyTheme();
    }
}
if (window.location.pathname.endsWith('settings.html')) {
    document.addEventListener('alpine:init', () => {
        Alpine.data('settings', () => window.__settings)
    })
}
else {
    window.__settings.init();
}
