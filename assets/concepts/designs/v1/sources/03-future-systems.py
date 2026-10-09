from design_helpers import (
    text, rect, line, path, icon, image, button, header, footer, save,
    WHITE, GREEN, OLIVE, GRAY, METAL, BLACK,
)

BACKGROUND = '#101714'
PANEL = '#121C17'
EDGE = '#2B3C31'


def link(href, content, name):
    return f'<a id="future-systems-{name}" href="{href}">{content}</a>'


def corners(x, y, width, height, length=18, color=GRAY):
    return path(
        f'M{x + length} {y}H{x}V{y + length}'
        f'M{x + width - length} {y}H{x + width}V{y + length}'
        f'M{x} {y + height - length}V{y + height}H{x + length}'
        f'M{x + width - length} {y + height}H{x + width}V{y + height - length}',
        stroke=color, opacity=.65,
    )


def definitions():
    return '''<defs>
      <linearGradient id="future-photo-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#020302" stop-opacity="0"/>
        <stop offset=".72" stop-color="#020302" stop-opacity="0"/>
        <stop offset="1" stop-color="#020302" stop-opacity=".92"/>
      </linearGradient>
      <linearGradient id="future-photo-edge" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#101714"/>
        <stop offset=".18" stop-color="#101714" stop-opacity="0"/>
        <stop offset="1" stop-color="#101714" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="future-ambient" cx=".72" cy=".35" r=".62">
        <stop offset="0" stop-color="#375540" stop-opacity=".2"/>
        <stop offset="1" stop-color="#375540" stop-opacity="0"/>
      </radialGradient>
    </defs>'''


def category(label, x, y, width, height, index, selected=False, mobile=False):
    size = 16 if mobile else 22
    body = rect(x, y, width, height, OLIVE if selected else PANEL, EDGE)
    body += rect(x, y, 3, height, GREEN if selected else EDGE)
    if mobile:
        body += text(label, x + 13, y + 28, size, WHITE, 'bold')
    else:
        body += text(f'0{index}', x + 15, y + 23, 10, GREEN if selected else GRAY, 'mono')
        body += text(label, x + 46, y + 37, size, WHITE, 'bold')
        body += icon('chevron', x + width - 31, y + 19, 20, GREEN if selected else GRAY)
    slug = {'Guns': 'guns', 'Swords': 'swords', 'Drones': 'drones', 'Future Tech': 'future-tech', 'Warfare History': 'warfare-history', 'History': 'warfare-history', 'Blogs': 'journal'}[label]
    return link(f'/catalog/{slug}' if slug != 'journal' else '/journal', body, f'category-{slug}')


def desktop():
    body = definitions() + rect(0, 0, 1600, 1000, BACKGROUND)
    body += rect(0, 119, 1600, 761, 'url(#future-ambient)')
    body += header()
    body += '<g id="future-systems-desktop-hero">'
    body += rect(607, 129, 945, 585, '#080D0A')
    body += image('future-drone.png', 607, 129, 945, 585, fit='xMidYMid meet')
    body += rect(607, 129, 945, 585, 'url(#future-photo-floor)')
    body += rect(607, 129, 945, 585, 'url(#future-photo-edge)')
    body += corners(647, 159, 875, 520)
    body += line(673, 196, 878, 196, GRAY, 1, .3)
    body += text('AIRFRAME STUDY / 03', 673, 181, 12, GRAY, 'mono', .8)
    body += text('DRONES + AUTONOMOUS SYSTEMS', 1202, 181, 10, GRAY, 'mono', .25)
    body += line(1428, 329, 1428, 407, GREEN, 1, .55)
    body += line(1389, 368, 1467, 368, GREEN, 1, .55)
    body += path('M1417 357H1439V379H1417Z', stroke=GREEN, opacity=.6)
    body += text('SYSTEMS INDEX', 673, 629, 11, GREEN, 'mono', 1.2)
    body += text('Autonomous reconnaissance', 673, 662, 31, WHITE, 'bold')
    body += text('The next chapter of the armory.', 674, 688, 16, GRAY, 'body')
    body += rect(48, 173, 3, 467, GREEN)
    body += rect(64, 172, 7, 7, GREEN)
    body += text('OPEN INTELLIGENCE / FUTURE SYSTEMS', 84, 181, 12, GREEN, 'mono', .65)
    body += text('Tomorrow’s', 61, 285, 100, WHITE, 'bold')
    body += text('Arsenal.', 61, 375, 100, WHITE, 'bold')
    body += text('Explore emerging weapons, autonomous systems,', 64, 430, 20, GRAY, 'body')
    body += text('and the ideas shaping modern warfare.', 64, 459, 20, GRAY, 'body')
    body += link('/catalog', button('Browse The Archive', 64, 502, 241, 56, True, 'arrow', 19), 'browse-archive')
    body += link('/loadout-lab', button('Build Loadout', 320, 502, 220, 56, False, 'sliders', 19), 'build-loadout')
    body += icon('shield', 64, 580, 16, GREEN)
    body += text('PUBLIC ACCESS', 89, 593, 11, GRAY, 'mono', .7)
    body += text('Browse freely. Sign in to save your collection.', 64, 619, 16, GRAY, 'body')
    body += line(64, 650, 537, 650, EDGE)
    body += icon('sliders', 64, 671, 20, GREEN)
    body += text('YOUR PERSONAL ARMORY', 96, 683, 12, WHITE, 'mono', .6)
    body += text('Scopes, attachments and cosmetics in Loadout Lab.', 64, 711, 15, GRAY, 'body')
    body += '</g><g id="future-systems-desktop-explore">'
    body += text('EXPLORE THE COLLECTION', 56, 737, 11, GRAY, 'mono', 1)
    labels = ['Guns', 'Swords', 'Drones', 'Future Tech', 'Warfare History', 'Blogs']
    for index, label in enumerate(labels):
        body += category(label, 56 + index * 249, 751, 239, 58, index + 1, label == 'Drones')
    body += '</g>'
    article = text('FIELD NOTES', 65, 850, 12, GREEN, 'mono', .8)
    article += line(186, 827, 186, 862, EDGE)
    article += text('The rise of autonomous reconnaissance', 211, 852, 24, WHITE, 'bold')
    article += text('TECHNOLOGY + WARFARE', 1207, 850, 11, GRAY, 'mono', .4)
    article += icon('arrow', 1510, 831, 24, GREEN)
    body += link('/journal', article, 'editorial-link')
    body += footer(880)
    save('03-future-systems-desktop', 1600, 1000, body, 'Future Systems — Weapon Database Desktop Concept')


def mobile():
    body = definitions() + rect(0, 0, 430, 1200, BACKGROUND)
    body += rect(0, 107, 430, 973, 'url(#future-ambient)')
    body += header(True)
    body += '<g id="future-systems-mobile-hero">'
    body += rect(24, 130, 6, 6, GREEN)
    body += text('OPEN INTELLIGENCE / FUTURE SYSTEMS', 41, 139, 10, GREEN, 'mono', .25)
    body += text('Tomorrow’s', 22, 211, 67, WHITE, 'bold')
    body += text('Arsenal.', 22, 270, 67, WHITE, 'bold')
    body += text('Weapons, emerging technology and', 24, 310, 18, GRAY, 'body')
    body += text('the stories shaping modern warfare.', 24, 337, 18, GRAY, 'body')
    body += rect(20, 369, 390, 271, '#080D0A')
    body += image('future-drone.png', 20, 369, 390, 271, fit='xMidYMid meet')
    body += rect(20, 369, 390, 271, 'url(#future-photo-floor)')
    body += corners(29, 380, 372, 247, 14)
    body += text('AIRFRAME STUDY / 03', 40, 401, 9, GRAY, 'mono', .4)
    body += text('AUTONOMOUS SYSTEMS', 40, 611, 20, WHITE, 'bold', .3)
    body += link('/catalog', button('Browse The Archive', 24, 662, 382, 52, True, 'arrow', 19), 'browse-archive-mobile')
    body += link('/loadout-lab', button('Build Loadout', 24, 727, 382, 52, False, 'sliders', 19), 'build-loadout-mobile')
    body += icon('bookmark', 24, 798, 17, GREEN)
    body += link('/sign-in', text('Sign In To Save Gear', 51, 812, 17, WHITE, 'ui'), 'save-gear-mobile')
    body += text('Scopes, attachments & cosmetics in Loadout Lab.', 24, 837, 15, GRAY, 'body')
    body += '</g><g id="future-systems-mobile-explore">'
    body += text('EXPLORE THE COLLECTION', 24, 864, 10, GRAY, 'mono', .6)
    labels = ['Guns', 'Swords', 'Drones', 'Future Tech', 'History', 'Blogs']
    for index, label in enumerate(labels):
        body += category(label, 24 + (index % 3) * 130, 878 + (index // 3) * 53, 122, 43, index + 1, label == 'Drones', True)
    body += '</g>'
    article = rect(24, 993, 382, 62, PANEL)
    article += rect(24, 993, 3, 62, GREEN)
    article += text('FIELD NOTES', 39, 1013, 10, GREEN, 'mono', .7)
    article += text('Inside autonomous reconnaissance', 39, 1041, 20, WHITE, 'bold')
    article += icon('arrow', 373, 1018, 20, GREEN)
    body += link('/journal', article, 'editorial-link-mobile')
    body += footer(1080, True)
    save('03-future-systems-mobile', 430, 1200, body, 'Future Systems — Weapon Database Mobile Concept')


desktop()
mobile()
