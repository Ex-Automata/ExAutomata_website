(function(){
  document.addEventListener('DOMContentLoaded', function() {
    // Palette select
    const paletteSelect = document.getElementById('palette-select');
    const palettes = ThemeManager.getPalettes && ThemeManager.getPalettes();
    if (palettes) {
      for (const [key, label] of Object.entries(palettes)) {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = label;
        paletteSelect.appendChild(opt);
      }
      paletteSelect.value = ThemeManager.getPalette() || Object.keys(palettes)[0];
      paletteSelect.onchange = function() { ThemeManager.setPalette(this.value); };
    }

    // Theme select
    const themeSelect = document.getElementById('theme-select');
    const themes = ThemeManager.getThemes && ThemeManager.getThemes();
    if (themes) {
      for (const [key, label] of Object.entries(themes)) {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = label;
        themeSelect.appendChild(opt);
      }
      themeSelect.value = ThemeManager.getTheme() || Object.keys(themes)[0];
      themeSelect.onchange = function() { ThemeManager.setTheme(this.value); };
    }
  });
})();