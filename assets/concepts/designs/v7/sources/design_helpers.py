from pathlib import Path
import base64
import re
import html
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

PACKAGE = Path(__file__).resolve().parents[1]
OFFICIAL = PACKAGE.parents[2] / 'logos/v1'
WHITE, GREEN, OLIVE, GRAY, METAL, CHARCOAL, BLACK, RED = '#F8F8F8', '#81BC34', '#375540', '#859398', '#565B64', '#17181A', '#020302', '#E5302B'
FONT_FILES = {'ui': 'Rajdhani-SemiBold.ttf', 'bold': 'Rajdhani-Bold.ttf', 'body': 'Barlow-Regular.ttf', 'display': 'SairaStencilOne-Regular.ttf', 'mono': 'JetBrainsMono-Regular.ttf'}
FONTS = {}
for key, filename in FONT_FILES.items():
    font = TTFont(OFFICIAL / 'fonts' / filename)
    FONTS[key] = (font, font.getGlyphSet(), font.getBestCmap(), font['head'].unitsPerEm)
CREST = (OFFICIAL / '01-armory-crest-mark.svg').read_text(encoding='utf-8-sig')
CREST = re.sub(r'^.*?<svg\b[^>]*>', '', CREST, count=1, flags=re.S)
CREST = re.sub(r'</svg>\s*$', '', CREST)
WORDMARK = (OFFICIAL / '05-weapon-database-wordmark.svg').read_text(encoding='utf-8-sig')
WORDMARK = re.search(r'<path[^>]*\bd="([^"]+)"', WORDMARK).group(1)
SERIAL = 0

def measure(value, size, font='ui', spacing=0):
    family, _, cmap, units = FONTS[font]
    return sum(family['hmtx'][cmap.get(ord(character), '.notdef')][0] * size / units + spacing for character in value)

def text(value, x, y, size=18, color=WHITE, font='ui', spacing=0):
    family, glyphs, cmap, units = FONTS[font]
    pen = SVGPathPen(glyphs)
    advance, scale = x, size / units
    for character in value:
        glyph_name = cmap.get(ord(character), '.notdef')
        glyphs[glyph_name].draw(TransformPen(pen, (scale, 0, 0, -scale, advance, y)))
        advance += family['hmtx'][glyph_name][0] * scale + spacing
    return f'<path aria-label="{html.escape(value, quote=True)}" fill="{color}" d="{pen.getCommands()}"/>'

def rect(x, y, w, h, fill=CHARCOAL, stroke=None, sw=1, radius=0, opacity=1):
    outline = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ''
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" opacity="{opacity}"{outline}/>'

def line(x1, y1, x2, y2, color=METAL, width=1, opacity=1):
    return f'<path d="M{x1} {y1}L{x2} {y2}" fill="none" stroke="{color}" stroke-width="{width}" opacity="{opacity}"/>'

def path(d, fill='none', stroke=GRAY, width=1, opacity=1):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" opacity="{opacity}"/>'

def image(name, x, y, w, h, opacity=1, fit='xMidYMid slice'):
    data = base64.b64encode((PACKAGE / 'assets' / name).read_bytes()).decode()
    return f'<image x="{x}" y="{y}" width="{w}" height="{h}" href="data:image/png;base64,{data}" preserveAspectRatio="{fit}" opacity="{opacity}"/>'

def crest(x, y, w):
    global SERIAL
    SERIAL += 1
    body = CREST
    for name in sorted(set(re.findall(r'\bid="([^"]+)"', body)), key=len, reverse=True):
        body = body.replace(f'id="{name}"', f'id="c{SERIAL}-{name}"').replace(f'href="#{name}"', f'href="#c{SERIAL}-{name}"').replace(f'url(#{name})', f'url(#c{SERIAL}-{name})')
    return f'<g transform="translate({x} {y}) scale({w / 788})">{body}</g>'

def wordmark(x, y, width, color=WHITE):
    return f'<g transform="translate({x} {y}) scale({width / 701}) translate(-277 -879)"><path fill="{color}" fill-rule="evenodd" d="{WORDMARK}"/></g>'

def brand(x, y, scale=1):
    return f'<g transform="translate({x} {y}) scale({scale})">{crest(0, 0, 54)}{wordmark(72, 7, 160)}</g>'

ICONS = {
    'arrow': 'M5 12H20M14 6L20 12L14 18',
    'search': 'M17 17L22 22M18 10A8 8 0 1 1 2 10A8 8 0 1 1 18 10',
    'bookmark': 'M6 3H18V22L12 17L6 22Z',
    'user': 'M16 7A4 4 0 1 1 8 7A4 4 0 1 1 16 7M4 22V19C4 12 20 12 20 19V22',
    'menu': 'M3 6H21M3 12H21M3 18H21',
    'plus': 'M12 3V21M3 12H21',
    'grid': 'M3 3H10V10H3ZM14 3H21V10H14ZM3 14H10V21H3ZM14 14H21V21H14Z',
    'sliders': 'M3 6H21M3 12H21M3 18H21M8 3V9M16 9V15M8 15V21',
    'shield': 'M12 2L21 6V12C21 17 17 21 12 23C7 21 3 17 3 12V6Z',
    'lock': 'M6 10V7C6 0 18 0 18 7V10M4 10H20V23H4ZM12 15V19',
    'chevron': 'M9 5L16 12L9 19',
    'crosshair': 'M12 1V7M12 17V23M1 12H7M17 12H23M19 12A7 7 0 1 1 5 12A7 7 0 1 1 19 12',
    'book': 'M3 3H9L12 6L15 3H21V21H15L12 23L9 21H3ZM12 6V23',
    'clock': 'M21 12A9 9 0 1 1 3 12A9 9 0 1 1 21 12M12 6V12L17 15',
}

def icon(name, x, y, size=24, color=WHITE):
    return f'<g transform="translate({x} {y}) scale({size / 24})"><path d="{ICONS.get(name, ICONS["arrow"])}" fill="none" stroke="{color}" stroke-width="1.65" stroke-linecap="square" stroke-linejoin="miter"/></g>'

def button(label, x, y, w, h, primary=True, icon_name='arrow', size=18):
    fill, fg = (GREEN, BLACK) if primary else (CHARCOAL, WHITE)
    body = rect(x, y, w, h, fill, GREEN if primary else METAL)
    body += text(label, x + 20, y + h / 2 + size * .32, size, fg, 'bold')
    if icon_name:
        body += icon(icon_name, x + w - 40, y + h / 2 - 11, 22, fg)
    return body

def header(mobile=False):
    if mobile:
        body = rect(0, 0, 430, 25, OLIVE) + text('THE ARMORY ARCHIVE', 20, 17, 9, WHITE, 'mono', .6)
        body += text('WEAPON DATABASE', 290, 17, 8, WHITE, 'mono')
        body += rect(0, 25, 430, 82, BLACK) + brand(17, 37, .8)
        body += icon('user', 339, 54, 23, GRAY) + icon('menu', 388, 54, 24)
        return body + line(20, 106, 410, 106, METAL)
    body = rect(0, 0, 1600, 27, OLIVE) + text('THE ARMORY ARCHIVE / WEAPON DATABASE', 48, 18, 10, WHITE, 'mono', .5)
    body += text('MODELS. STORIES. POSSIBILITIES.', 1265, 18, 10, WHITE, 'mono')
    body += rect(0, 27, 1600, 92, BLACK) + brand(46, 39)
    for value, x in [('Catalog', 482), ('Loadout Lab', 604), ('Journal', 781), ('Warfare History', 906), ('Future Tech', 1121)]:
        body += text(value, x, 83, 20)
    body += icon('bookmark', 1317, 62, 23, GRAY) + button('Sign In', 1390, 48, 161, 49, False, 'user', 18)
    return body + line(48, 118, 1552, 118, METAL)

def footer(y, mobile=False):
    if mobile:
        body = rect(0, y, 430, 120, BLACK) + line(20, y, 410, y, METAL)
        for value, x in [('About', 20), ('Contact', 89), ('Terms', 175), ('Privacy', 245)]:
            body += text(value, x, y + 37, 15, GRAY)
        body += text('© 2026 Weapon Database', 20, y + 78, 12, GRAY, 'body')
        body += '<a href="https://piratechs.com/" target="_blank">' + text('Piratechs.com', 294, y + 78, 13, WHITE) + '</a>'
        return body
    body = rect(0, y, 1600, 120, BLACK) + line(48, y, 1552, y, METAL)
    body += icon('shield', 48, y + 25, 26, GREEN) + text('THE ARMORY ARCHIVE', 88, y + 47, 24, WHITE, 'bold', 1)
    body += text('Research the past. Explore what comes next.', 48, y + 87, 15, GRAY, 'body')
    body += text('© 2026 Weapon Database', 717, y + 87, 13, GRAY, 'body')
    for value, x in [('About', 1080), ('Contact', 1147), ('Terms', 1230), ('Privacy', 1297)]:
        body += text(value, x, y + 43, 16, GRAY)
    body += '<a href="https://piratechs.com/" target="_blank">' + text('Piratechs.com', 1418, y + 87, 18, WHITE) + '</a>'
    return body

def save(name, w, h, body, title):
    target = PACKAGE / f'{name}.svg'
    target.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-labelledby="design-title"><title id="design-title">{html.escape(title)}</title><desc>Weapon Database landing-page design concept using the adopted v23 crest, official colors and bundled fonts. Static visual exploration with sample catalog content.</desc>{body}</svg>\n', encoding='utf-8')
    print(f'Design Saved: {target.name}')
