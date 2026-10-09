from design_helpers import *
from math import cos, sin, radians

THEMES = {
    'dark': {'name': 'BLACKENED STEEL', 'bg': BLACK, 'fg': WHITE, 'muted': GRAY, 'rule': '#303537', 'surface': BLACK, 'link': GREEN, 'texture': 'dark-brushed-steel.png'},
    'light': {'name': 'SILVER + BLACK', 'bg': '#EDF0F2', 'fg': '#000000', 'muted': METAL, 'rule': '#B5BDC0', 'surface': WHITE, 'link': OLIVE, 'texture': 'light-brushed-steel.png'},
}
ICONS['sun'] = 'M16 12A4 4 0 1 1 8 12A4 4 0 1 1 16 12M12 1V4M12 20V23M1 12H4M20 12H23M4 4L6 6M18 18L20 20M4 20L6 18M18 6L20 4'
ICONS['moon'] = 'M20 15A9 9 0 1 1 9 3A7 7 0 0 0 20 15Z'

def black_panel(theme):
    panel = theme.copy()
    panel.update({'bg': BLACK, 'fg': WHITE, 'muted': GRAY, 'rule': '#303537', 'surface': BLACK, 'link': GREEN})
    return panel

def material(theme, width, height):
    color = theme['bg']
    dark = theme['name'] == 'BLACKENED STEEL'
    veil = (.96, .89, .58) if dark else (.88, .66, .17)
    body = f'''<defs>
    <linearGradient id="steel-veil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{color}" stop-opacity="{veil[0]}"/><stop offset=".45" stop-color="{color}" stop-opacity="{veil[1]}"/><stop offset="1" stop-color="{color}" stop-opacity="{veil[2]}"/></linearGradient>
    <radialGradient id="steel-sheen"><stop offset="0" stop-color="{GRAY if theme['name'] == 'BLACKENED STEEL' else WHITE}" stop-opacity="{.09 if dark else .16}"/><stop offset="1" stop-color="{color}" stop-opacity="0"/></radialGradient>
    <filter id="weapon-shadow" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>'''
    body += rect(0, 0, width, height, color)
    body += image(theme['texture'], 0, 0, width, height, .72 if dark else .85)
    body += rect(0, 0, width, height, 'url(#steel-veil)')
    body += f'<ellipse cx="{width * .75}" cy="{height * .4}" rx="{width * .38}" ry="{height * .45}" fill="url(#steel-sheen)"/>'
    return body

def identity(x, y, theme, scale=1):
    return f'<g transform="translate({x} {y}) scale({scale})">{crest(0, 0, 50)}{wordmark(68, 4, 153, theme["fg"])}</g>'

def oval_arc(rx, ry, start, end):
    angle_start, angle_end = radians(start), radians(end)
    x1, y1 = rx * cos(angle_start), ry * sin(angle_start)
    x2, y2 = rx * cos(angle_end), ry * sin(angle_end)
    return f'M{x1:.3f} {y1:.3f}A{rx} {ry} 0 0 1 {x2:.3f} {y2:.3f}'

def vault_oval(theme, mobile=False):
    dark = theme['name'] == 'BLACKENED STEEL'
    cx, cy, scale, angle = (215, 574, .47, -6) if mobile else (1143, 456, 1, -8)
    rim_opacity, recess_opacity = (.36, .18) if dark else (.31, .035)
    body = f'''<defs>
    <linearGradient id="vault-rim" x1="0" y1="0" x2=".25" y2="1"><stop stop-color="{GRAY}"/><stop offset=".25" stop-color="{METAL}"/><stop offset=".52" stop-color="{BLACK}"/><stop offset=".78" stop-color="{GRAY}"/><stop offset="1" stop-color="{METAL}"/></linearGradient>
    <radialGradient id="vault-recess"><stop offset=".5" stop-color="{BLACK}" stop-opacity="0"/><stop offset="1" stop-color="{BLACK}" stop-opacity="{recess_opacity}"/></radialGradient>
    </defs>'''
    body += f'<g id="vault-oval-surround" transform="translate({cx} {cy}) rotate({angle}) scale({scale})">'
    body += '<ellipse rx="388" ry="169" fill="url(#vault-recess)"/>'
    body += f'<ellipse rx="388" ry="169" fill="none" stroke="{METAL}" stroke-width="1" opacity="{.25 if dark else .22}"/>'
    body += f'<ellipse rx="379" ry="160" fill="none" stroke="url(#vault-rim)" stroke-width="12" opacity="{rim_opacity}"/>'
    body += f'<ellipse rx="371" ry="152" fill="none" stroke="{BLACK}" stroke-width="2" opacity="{.7 if dark else .19}"/>'
    body += f'<ellipse rx="366" ry="147" fill="none" stroke="{GRAY}" stroke-width=".7" opacity="{.12 if dark else .15}"/>'
    for start, end in [(204, 216), (24, 36)]:
        body += path(oval_arc(379, 160, start, end), 'none', GREEN if dark else OLIVE, 2, .4 if dark else .29)
    for start, end in [(58, 68), (112, 122), (238, 248), (292, 302)]:
        body += path(oval_arc(379, 160, start, end), 'none', BLACK, 5, .64 if dark else .27)
    for position in [44, 224]:
        x, y = 379 * cos(radians(position)), 160 * sin(radians(position))
        body += f'<ellipse cx="{x:.3f}" cy="{y:.3f}" rx="3" ry="3" fill="{OLIVE}" stroke="{BLACK}" stroke-width="1" opacity="{.65 if dark else .35}"/>'
    return body + '</g>'

def navigation(theme, mobile=False):
    theme = black_panel(theme)
    fg, muted, bg, rule = theme['fg'], theme['muted'], theme['bg'], theme['rule']
    if mobile:
        body = rect(0, 0, 430, 22, bg) + text('THE PUBLIC ARMORY', 20, 15, 8, muted, 'mono', .5)
        body += text('VAULT / 01', 346, 15, 8, muted, 'mono')
        body += rect(0, 22, 430, 76, bg) + identity(16, 33, theme, .8)
        body += icon('sun' if theme['name'] == 'BLACKENED STEEL' else 'moon', 337, 47, 21, muted)
        body += icon('menu', 386, 47, 24, fg)
        return body + line(20, 98, 410, 98, rule)
    body = rect(0, 0, 1600, 25, bg)
    body += text('THE WEAPON ARCHIVE / WEAPON DATABASE', 64, 17, 9, muted, 'mono', .7)
    body += text('MODELS. HISTORY. POSSIBILITIES.', 1256, 17, 9, muted, 'mono')
    body += rect(0, 25, 1600, 85, bg) + identity(59, 36, theme)
    for label, x in [('Catalog', 501), ('Loadout Lab', 622), ('Journal', 798), ('Warfare History', 922)]:
        body += text(label, x, 75, 20, fg)
    body += icon('sun' if theme['name'] == 'BLACKENED STEEL' else 'moon', 1275, 52, 22, muted)
    body += line(1325, 45, 1325, 87, rule)
    body += icon('bookmark', 1350, 53, 21, muted)
    body += rect(1400, 43, 136, 48, theme['surface'], rule)
    body += text('Sign In', 1420, 74, 19, fg, 'bold') + icon('user', 1495, 55, 21, fg)
    return body + line(64, 110, 1536, 110, rule)

def search(x, y, width, theme, mobile=False):
    theme = black_panel(theme)
    height = 56 if mobile else 64
    body = rect(x, y, width, height, theme['surface'], theme['rule'], opacity=.98)
    body += icon('search', x + 20, y + (height - 22) / 2, 22, theme['muted'])
    body += text('Search the armory...' if mobile else 'Search models, eras and platforms...', x + 59, y + height / 2 + 6, 18, theme['muted'], 'body')
    body += rect(x + width - height + 6, y + 6, height - 12, height - 12, GREEN)
    body += icon('arrow', x + width - height / 2 - 12, y + height / 2 - 12, 24, BLACK)
    return body

def signature(theme, y, mobile=False):
    theme = black_panel(theme)
    fg, muted = theme['fg'], theme['muted']
    if mobile:
        body = rect(0, y, 430, 80, theme['bg']) + line(20, y, 410, y, theme['rule'])
        for value, x in [('About', 20), ('Contact', 88), ('Terms', 172), ('Privacy', 239)]:
            body += text(value, x, y + 31, 15, muted)
        body += text('© 2026 Weapon Database', 20, y + 66, 12, muted, 'body')
        body += '<a href="https://piratechs.com/" target="_blank">' + text('Piratechs.com', 294, y + 66, 13, fg) + '</a>'
        return body
    body = rect(0, y, 1600, 80, theme['bg']) + line(64, y, 1536, y, theme['rule'])
    body += text('© 2026 Weapon Database', 64, y + 48, 14, muted, 'body')
    body += text('THE PUBLIC ARMORY', 657, y + 48, 10, muted, 'mono', .7)
    for value, x in [('About', 1039), ('Contact', 1109), ('Terms', 1194), ('Privacy', 1260)]:
        body += text(value, x, y + 48, 16, muted)
    body += '<a href="https://piratechs.com/" target="_blank">' + text('Piratechs.com', 1410, y + 48, 18, fg) + '</a>'
    return body

def loadout_strip(x, y, width, theme, mobile=False):
    theme = black_panel(theme)
    body = rect(x, y, width, 61, theme['surface'], opacity=.96)
    body += line(x, y, x + width, y, theme['rule'])
    body += text('SKIN', x + 18, y + 36, 10, theme['muted'], 'mono', .5)
    for index, color in enumerate((OLIVE, CHARCOAL, GRAY)):
        body += rect(x + 65 + index * 31, y + 20, 23, 23, color, GREEN if index == 0 else theme['rule'])
    body += line(x + 167, y + 19, x + 167, y + 44, theme['rule'])
    body += text('OPTICS + ATTACHMENTS' if not mobile else 'OPTICS + PARTS', x + 186, y + 36, 12 if mobile else 14, theme['fg'], 'ui')
    body += icon('sliders', x + width - 40, y + 20, 22, theme['link'])
    return body

def desktop(theme_key):
    theme = THEMES[theme_key]
    fg, muted, rule = theme['fg'], theme['muted'], theme['rule']
    body = material(theme, 1600, 1080) + navigation(theme)
    body += rect(64, 192, 20, 2, theme['link']) + text('01 / THE PUBLIC ARMORY', 102, 198, 11, muted, 'mono', 1)
    body += text('OPEN THE', 62, 310, 98, fg, 'display')
    body += text('ARMORY.', 62, 438, 117, GREEN if theme_key == 'dark' else fg, 'display')
    body += text('Every weapon has a story.', 65, 494, 24, fg, 'body')
    body += text('Find yours in the archive.', 65, 530, 24, fg, 'body')
    body += text('Firearms, swords, drones and the systems of tomorrow.', 65, 569, 18, muted, 'body')
    body += search(64, 610, 584, theme)
    body += text('Explore catalog', 64, 720, 22, fg, 'bold') + icon('arrow', 232, 700, 24, theme['link'])
    body += line(289, 695, 289, 726, rule)
    body += icon('sliders', 320, 701, 22, theme['link']) + text('Build a loadout', 357, 720, 22, fg)
    body += icon('bookmark', 65, 757, 16, muted) + text('Sign in to save weapons and custom classes.', 92, 770, 15, muted, 'body')
    body += text('FEATURED ENTRY / 001', 749, 198, 11, muted, 'mono', .9)
    body += rect(1464, 181, 72, 23, BLACK, '#303537')
    body += text('ARCHIVE', 1474, 197, 9, GRAY, 'mono')
    body += line(750, 221, 1536, 221, rule, 1, .5)
    body += vault_oval(theme)
    body += '<ellipse cx="1158" cy="627" rx="315" ry="25" fill="#020302" opacity=".24" filter="url(#weapon-shadow)"/>'
    body += '<g transform="rotate(-8 1115 451)">' + image('armory-rifle-isolated.png', 680, 285, 867, 315, fit='xMidYMid meet') + '</g>'
    body += line(749, 672, 1536, 672, rule)
    body += text('ARX-27', 749, 718, 36, fg, 'bold')
    body += text('MODULAR PLATFORM / VISUAL LOADOUT', 910, 713, 10, muted, 'mono', .2)
    body += text('View dossier', 1355, 714, 20, fg) + icon('arrow', 1508, 696, 25, theme['link'])
    body += loadout_strip(749, 753, 787, theme)
    index = black_panel(theme)
    body += rect(0, 850, 1600, 150, BLACK)
    body += line(64, 850, 1536, 850, index['rule'])
    body += text('EXPLORE THE INDEX', 64, 880, 10, index['muted'], 'mono', 1)
    items = [('01', 'Firearms', 'Rifles / Sidearms', 64), ('02', 'Swords', 'Blades / Heritage', 310), ('03', 'Drones', 'Air / Autonomous', 539), ('04', 'Future Tech', 'Research / Systems', 770)]
    for number, title, subtitle, x in items:
        body += text(number, x, 923, 11, index['link'], 'mono')
        body += text(title, x + 30, 926, 28, index['fg'], 'bold')
        body += text(subtitle, x + 30, 955, 15, index['muted'], 'body')
    body += line(1056, 894, 1056, 967, index['rule'])
    body += text('FIELD NOTES / JOURNAL + HISTORY', 1092, 903, 9, index['link'], 'mono', .5)
    body += text('Weapons. Warfare.', 1092, 932, 25, index['fg'], 'bold')
    body += text('What comes next.', 1092, 958, 21, index['muted'], 'body')
    body += icon('arrow', 1509, 922, 26, index['link'])
    body += signature(theme, 1000)
    save(f'0{1 if theme_key == "dark" else 2}-armory-vault-{theme_key}-desktop', 1600, 1080, body, f'Weapon Database — Refined Armory Vault, {theme["name"].title()}, Desktop')

def mobile(theme_key):
    theme = THEMES[theme_key]
    fg, muted, rule = theme['fg'], theme['muted'], theme['rule']
    body = material(theme, 430, 1180) + navigation(theme, True)
    body += rect(20, 140, 15, 2, theme['link']) + text('01 / THE PUBLIC ARMORY', 49, 145, 9, muted, 'mono', .4)
    body += text('OPEN THE', 18, 216, 58, fg, 'display')
    body += text('ARMORY.', 18, 292, 69, GREEN if theme_key == 'dark' else fg, 'display')
    body += text('Every weapon has a story.', 20, 337, 18, fg, 'body')
    body += text('Find yours in the archive.', 20, 365, 18, fg, 'body')
    body += search(20, 393, 390, theme, True)
    body += text('FEATURED ENTRY / 001', 20, 486, 9, muted, 'mono', .5)
    body += vault_oval(theme, True)
    body += '<ellipse cx="241" cy="624" rx="142" ry="12" fill="#020302" opacity=".2" filter="url(#weapon-shadow)"/>'
    body += '<g transform="rotate(-6 215 557)">' + image('armory-rifle-isolated.png', 16, 500, 397, 145, fit='xMidYMid meet') + '</g>'
    body += text('ARX-27', 20, 684, 27, fg, 'bold')
    body += text('View dossier', 277, 681, 17, fg) + icon('arrow', 385, 666, 20, theme['link'])
    body += loadout_strip(20, 704, 390, theme, True)
    body += icon('sliders', 20, 791, 20, theme['link']) + text('Build your loadout', 54, 808, 20, fg, 'bold')
    body += text('Sign in to save weapons and custom classes.', 20, 839, 14, muted, 'body')
    index = black_panel(theme)
    body += rect(0, 865, 430, 235, BLACK)
    body += line(20, 865, 410, 865, index['rule'])
    items = [('01', 'Firearms', 20, 905), ('02', 'Swords', 223, 905), ('03', 'Drones', 20, 961), ('04', 'Future Tech', 223, 961)]
    for number, title, x, y in items:
        body += text(number, x, y - 2, 10, index['link'], 'mono')
        body += text(title, x + 30, y, 24, index['fg'], 'bold')
    body += line(20, 991, 410, 991, index['rule'])
    body += text('FIELD NOTES / JOURNAL + HISTORY', 20, 1022, 9, index['link'], 'mono', .2)
    body += text('Weapons. Warfare. What comes next.', 20, 1055, 19, index['fg'], 'bold')
    body += icon('arrow', 385, 1038, 23, index['link'])
    body += signature(theme, 1100, True)
    save(f'0{1 if theme_key == "dark" else 2}-armory-vault-{theme_key}-mobile', 430, 1180, body, f'Weapon Database — Refined Armory Vault, {theme["name"].title()}, Mobile')

def include(name, x, y, width, source_width):
    content = (PACKAGE / f'{name}.svg').read_text(encoding='utf-8')
    content = re.sub(r'^.*?<svg\b[^>]*>', '', content, count=1, flags=re.S)
    content = re.sub(r'</svg>\s*$', '', content)
    for identifier in sorted(set(re.findall(r'\bid="([^"]+)"', content)), key=len, reverse=True):
        content = content.replace(f'id="{identifier}"', f'id="{name}-{identifier}"').replace(f'href="#{identifier}"', f'href="#{name}-{identifier}"').replace(f'url(#{identifier})', f'url(#{name}-{identifier})')
    return f'<g transform="translate({x} {y}) scale({width / source_width})">{content}</g>'

def paired_board(theme_key):
    theme = THEMES[theme_key]
    bg = '#020302' if theme_key == 'dark' else '#DFE4E5'
    body = rect(0, 0, 2240, 1440, bg)
    body += text('ARMORY VAULT', 70, 85, 46, theme['fg'], 'display')
    body += text(f'05 / {theme["name"]}', 535, 82, 22, theme['muted'], 'mono', .5)
    body += text('A refined weapon archive. A personal armory.', 70, 133, 25, theme['muted'], 'body')
    body += text('DESKTOP / 1600 × 1080', 70, 192, 15, theme['link'], 'mono', .3)
    body += text('MOBILE / 430 × 1180', 1770, 192, 15, theme['link'], 'mono', .3)
    prefix = f'0{1 if theme_key == "dark" else 2}-armory-vault-{theme_key}'
    body += include(f'{prefix}-desktop', 70, 224, 1600, 1600)
    body += include(f'{prefix}-mobile', 1770, 224, 430 * 1080 / 1180, 430)
    body += rect(70, 224, 1600, 1080, 'none', theme['rule'])
    body += rect(1770, 224, 430 * 1080 / 1180, 1080, 'none', theme['rule'])
    body += text('WEAPON DATABASE / OFFICIAL CREST + TYPE / DESIGN ROUND V5', 70, 1380, 14, theme['muted'], 'mono', .3)
    save(f'0{3 if theme_key == "dark" else 4}-armory-vault-{theme_key}-pair', 2240, 1440, body, f'Weapon Database — {theme["name"].title()}, Desktop With Mobile Beside It')

for theme_key in THEMES:
    desktop(theme_key)
    mobile(theme_key)
    paired_board(theme_key)
body = include('03-armory-vault-dark-pair', 0, 0, 2240, 2240) + include('04-armory-vault-light-pair', 0, 1440, 2240, 2240)
save('00-armory-vault-steel-comparison', 2240, 2880, body, 'Weapon Database — Armory Vault Oval Steel Refinement, Dark and Light, Desktop Beside Mobile')
