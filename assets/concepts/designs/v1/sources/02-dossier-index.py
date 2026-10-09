from design_helpers import *

def group(name, content):
    return f'<g id="{name}">{content}</g>'

def category_icon(category, x, y, size=30, color=GRAY):
    drawings = {
        'guns': '<path d="M4 9H21V14H15L12 20H8L10 14H4ZM7 6H20M16 14V17H13"/>',
        'swords': '<path d="M12 2L15 7V15L12 18L9 15V7ZM6 18H18M12 18V23M10 23H14"/>',
        'drones': '<path d="M8 8L16 16M16 8L8 16M9 10H15V14H9Z"/><circle cx="5" cy="5" r="4"/><circle cx="19" cy="5" r="4"/><circle cx="5" cy="19" r="4"/><circle cx="19" cy="19" r="4"/>',
        'future': '<path d="M8 7H16V17H8ZM3 4H8V7M16 7V4H21M3 20H8V17M16 17V20H21M2 12H8M16 12H22M12 2V7M12 17V22"/>',
    }
    return f'<g transform="translate({x} {y}) scale({size / 24})" fill="none" stroke="{color}" stroke-width="1.5" stroke-linejoin="miter">{drawings[category]}</g>'

def search_field(x, y, w, mobile=False):
    body = rect(x, y, w, 60 if mobile else 64, BLACK, METAL)
    body += icon('search', x + 20, y + 19, 25, GRAY)
    body += text('Search the catalog', x + 61, y + 39, 20, GRAY, 'body')
    body += rect(x + w - 58, y + 7, 51, 46 if mobile else 50, GREEN)
    body += group('submit-catalog-search', icon('arrow', x + w - 43, y + 18, 25, BLACK))
    return body

def category_tile(category, label, subtitle, number, x, y, w, mobile=False):
    selected = category == 'swords'
    body = rect(x, y, w, 76 if mobile else 84, BLACK, GREEN if selected else METAL)
    if selected:
        body += rect(x, y, 3, 76 if mobile else 84, GREEN)
    if mobile:
        body += text(number, x + 16, y + 23, 13, GREEN if selected else GRAY, 'mono')
        body += text(label, x + 16, y + 57, 24, WHITE, 'bold')
        body += category_icon(category, x + w - 46, y + 14, 28, GREEN if selected else GRAY)
    else:
        body += category_icon(category, x + 24, y + 25, 31, GREEN if selected else GRAY)
        body += text(label, x + 73, y + 37, 25, WHITE, 'bold')
        body += text(subtitle, x + 73, y + 63, 17, GRAY, 'body')
        body += text(number, x + w - 46, y + 24, 12, GREEN if selected else GRAY, 'mono')
        body += icon('arrow', x + w - 47, y + 46, 21, GRAY)
    return group(f'category-{category}-{"mobile" if mobile else "desktop"}', body)

def desktop():
    body = rect(0, 0, 1600, 1000, CHARCOAL)
    body += rect(0, 119, 1600, 596, CHARCOAL)
    body += line(800, 157, 800, 703, METAL, 1, .42)
    body += header()
    lead = rect(64, 172, 5, 15, GREEN)
    lead += text('WEAPON DATABASE / PUBLIC CATALOG', 84, 185, 13, GRAY, 'mono', .4)
    lead += text('The armory,', 64, 279, 80, WHITE, 'display')
    lead += text('indexed.', 64, 370, 80, WHITE, 'display')
    lead += text('Browse weapons by design, category, and history.', 66, 422, 20, GRAY, 'body')
    lead += text('Keep the details that interest you.', 66, 453, 20, GRAY, 'body')
    lead += group('archive-search-desktop', search_field(64, 488, 672))
    lead += text('Public browsing. Sign in to save.', 66, 581, 17, GRAY, 'body')
    collection = rect(64, 608, 672, 94, BLACK, METAL)
    collection += rect(64, 608, 3, 94, GREEN)
    collection += icon('bookmark', 87, 632, 25, GREEN)
    collection += text('Your Collection Starts Here', 131, 644, 25, WHITE, 'bold')
    collection += text('Save entries and customize your own loadout.', 131, 676, 18, GRAY, 'body')
    collection += icon('arrow', 687, 641, 27, GREEN)
    lead += group('loadout-entry-desktop', collection)
    body += group('archive-introduction-desktop', lead)
    dossier = path('M864 155H1518L1536 173V702H864Z', BLACK, METAL)
    dossier += rect(864, 155, 4, 44, GREEN)
    dossier += text('FEATURED DOSSIER', 888, 183, 14, GREEN, 'mono', .6)
    dossier += text('SWD-001', 1419, 183, 13, GRAY, 'mono')
    dossier += line(884, 199, 1516, 199, METAL)
    dossier += image('heritage-blade.png', 884, 212, 632, 386, fit='xMidYMid meet')
    dossier += text('SWORDS / CATALOG PREVIEW', 888, 622, 12, GRAY, 'mono', .3)
    dossier += text('Heritage Blade', 886, 663, 29, WHITE, 'display')
    dossier += text('Explore The Dossier', 1310, 661, 19, WHITE, 'bold')
    dossier += icon('arrow', 1477, 642, 25, GREEN)
    body += group('featured-dossier-desktop', dossier)
    body += line(64, 728, 1536, 728, METAL, 1, .75)
    body += text('Browse The Index', 64, 759, 24, WHITE, 'bold')
    body += text('A CATEGORY FOR EVERY CURIOSITY', 1192, 757, 12, GRAY, 'mono', .25)
    categories = [('guns', 'Guns', 'Firearms & design', '01'), ('swords', 'Swords', 'Blades through history', '02'), ('drones', 'Drones', 'Flight & form', '03'), ('future', 'Future Tech', 'Emerging concepts', '04')]
    for index, (category, label, subtitle, number) in enumerate(categories):
        body += category_tile(category, label, subtitle, number, 64 + index * 372, 777, 356)
    body += footer(880)
    return body

def mobile():
    body = rect(0, 0, 430, 1200, CHARCOAL) + header(True)
    lead = rect(24, 129, 4, 13, GREEN)
    lead += text('PUBLIC CATALOG / WEAPON DATABASE', 40, 140, 11, GRAY, 'mono', .1)
    lead += text('The armory,', 24, 197, 49, WHITE, 'display')
    lead += text('indexed.', 24, 251, 49, WHITE, 'display')
    lead += text('Explore design, categories, and history.', 24, 288, 18, GRAY, 'body')
    lead += text('Sign in to save what inspires you.', 24, 314, 18, GRAY, 'body')
    lead += group('archive-search-mobile', search_field(24, 335, 382, True))
    body += group('archive-introduction-mobile', lead)
    dossier = path('M24 417H393L406 430V730H24Z', BLACK, METAL)
    dossier += rect(24, 417, 3, 32, GREEN)
    dossier += text('FEATURED DOSSIER / SWORDS', 41, 440, 12, GREEN, 'mono')
    dossier += image('heritage-blade.png', 25, 454, 380, 202, fit='xMidYMid meet')
    dossier += line(41, 660, 389, 660, METAL)
    dossier += text('Heritage Blade', 41, 695, 24, WHITE, 'display')
    dossier += text('Sample Dossier / SWD-001', 42, 719, 16, GRAY, 'ui')
    dossier += icon('arrow', 360, 680, 25, GREEN)
    body += group('featured-dossier-mobile', dossier)
    body += text('Browse The Index', 24, 769, 24, WHITE, 'bold')
    categories = [('guns', 'Guns', '', '01'), ('swords', 'Swords', '', '02'), ('drones', 'Drones', '', '03'), ('future', 'Future Tech', '', '04')]
    for index, (category, label, subtitle, number) in enumerate(categories):
        body += category_tile(category, label, subtitle, number, 24 + index % 2 * 198, 789 + index // 2 * 88, 184, True)
    collection = rect(24, 983, 382, 76, BLACK, METAL)
    collection += rect(24, 983, 3, 76, GREEN)
    collection += text('Build Your Loadout', 42, 1014, 23, WHITE, 'bold')
    collection += text('Sign in to save + customize.', 42, 1043, 18, GRAY, 'body')
    collection += rect(356, 1003, 32, 32, GREEN)
    collection += icon('arrow', 361, 1008, 22, BLACK)
    body += group('loadout-entry-mobile', collection)
    body += footer(1080, True)
    return body

save('02-dossier-index-desktop', 1600, 1000, desktop(), 'Weapon Database — Dossier Index Desktop')
save('02-dossier-index-mobile', 430, 1200, mobile(), 'Weapon Database — Dossier Index Mobile')
