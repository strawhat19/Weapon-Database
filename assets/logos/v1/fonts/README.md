# Weapon Database Fonts

These original, unmodified TrueType files are bundled for local web loading and installation in design or desktop applications. Keep the brand wordmark as the original custom outlined SVG artwork; use these fonts for supporting text.

| Role | Family | Bundled Weight(s) | CSS Family |
| --- | --- | --- | --- |
| Original Display Companion | Saira Stencil One | Regular 400 | `Weapon Saira Stencil One` |
| UI, Data, And Headings | Rajdhani | Regular 400, SemiBold 600, Bold 700 | `Weapon Rajdhani` |
| Readable Body Text | Barlow | Regular 400, Medium 500, SemiBold 600 | `Weapon Barlow` |
| Monospace Data And Code | JetBrains Mono | Regular 400 | `Weapon JetBrains Mono` |

Load [fonts.css](fonts.css) from the packaged font folder. Its font URLs are relative to that stylesheet, so the folder can move with the rest of the brand package without contacting an external font service.

```html
<link rel="stylesheet" href="./fonts/fonts.css">
```

```css
.brand-display { font-family: 'Weapon Saira Stencil One', sans-serif; font-weight: 400; }
.brand-heading { font-family: 'Weapon Rajdhani', sans-serif; font-weight: 700; }
.brand-body { font-family: 'Weapon Barlow', sans-serif; font-weight: 400; }
.brand-data { font-family: 'Weapon JetBrains Mono', monospace; font-weight: 400; }
```

All four families are supplied under the SIL Open Font License 1.1. Preserve each family's complete copyright notice and license when redistributing its font files: [Saira Stencil One](licenses/saira-stencil-one/OFL.txt), [Rajdhani](licenses/rajdhani/OFL.txt), [Barlow](licenses/barlow/OFL.txt), and [JetBrains Mono](licenses/jetbrains-mono/OFL.txt).

Saira Stencil One, Rajdhani, and Barlow were downloaded from the official Google Fonts repository at commit `51303ca9e8ac9dcea7b12d307ba568fd0e6fcfca`: [Saira Stencil One](https://github.com/google/fonts/tree/51303ca9e8ac9dcea7b12d307ba568fd0e6fcfca/ofl/sairastencilone), [Rajdhani](https://github.com/google/fonts/tree/51303ca9e8ac9dcea7b12d307ba568fd0e6fcfca/ofl/rajdhani), and [Barlow](https://github.com/google/fonts/tree/51303ca9e8ac9dcea7b12d307ba568fd0e6fcfca/ofl/barlow).

The original static JetBrains Mono Regular file and license were downloaded from [its official upstream repository](https://github.com/JetBrains/JetBrainsMono/tree/19371302b95d218af43299bce79ddbddd0bc364d/fonts/ttf) at commit `19371302b95d218af43299bce79ddbddd0bc364d`, which is the upstream revision recorded in [Google Fonts metadata](https://github.com/google/fonts/blob/51303ca9e8ac9dcea7b12d307ba568fd0e6fcfca/ofl/jetbrainsmono/METADATA.pb).

[font-metadata.json](font-metadata.json) records each exact source URL, font family and weight, file size, and SHA-256 digest. Downloaded on October 9, 2026. The eight TTF files total 1,865,000 bytes.
