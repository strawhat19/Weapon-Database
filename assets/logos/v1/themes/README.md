# Weapon Database Themes

Charcoal is the default theme. Graphite uses the crest's gunmetal gray; Light uses silver white. All themes preserve the official crest colors and provide CSS custom properties for surrounding layouts.

Use `themes.css` directly or import `themes.scss` in a Sass project, together with `../fonts/fonts.css`. Set `data-weapon-theme="charcoal"`, `data-weapon-theme="graphite"`, or `data-weapon-theme="light"` on the page or a wrapper. Use `var(--weapon-background)`, `var(--weapon-text)`, `var(--weapon-accent)` and the other tokens in your styles.

For stencil display text, use `--weapon-font-display` (Saira Stencil One). Use `--weapon-font-heading` (Rajdhani) for headings and UI, `--weapon-font-body` (Barlow) for body copy, and `--weapon-font-mono` (JetBrains Mono) for data labels. Official logo lettering remains the original custom stencil outlines from v15. The accent fill is Crest Green; `--weapon-on-accent` supplies dark text on that fill. `--weapon-accent-text` supplies theme-appropriate text for links and labels.

These files are a reusable asset package. They do not automatically change the application or recolor the SVG/PNG crest. Theme names and color values are also available in `themes.json`; the exact crest palette is in `../palettes/palette.json`.
