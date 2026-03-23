window.__settings = {
    THEME_KEY: 'theme',
    ANIMATION_KEY: 'animation',
    theme: localStorage.getItem('theme') || 'dark',
    animation: localStorage.getItem('animatinon') != 'false',
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
    }
}
window.__settings.applyTheme();
