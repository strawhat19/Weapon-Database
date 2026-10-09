from design_helpers import *

def include(name, x, y, width, source_width):
    content = (PACKAGE / f'{name}.svg').read_text(encoding='utf-8')
    content = re.sub(r'^.*?<svg\b[^>]*>', '', content, count=1, flags=re.S)
    content = re.sub(r'</svg>\s*$', '', content)
    for identifier in sorted(set(re.findall(r'\bid="([^"]+)"', content)), key=len, reverse=True):
        content = content.replace(f'id="{identifier}"', f'id="{name}-{identifier}"').replace(f'href="#{identifier}"', f'href="#{name}-{identifier}"').replace(f'url(#{identifier})', f'url(#{name}-{identifier})')
    return f'<g transform="translate({x} {y}) scale({width / source_width})">{content}</g>'

body = rect(0, 0, 2400, 1680, CHARCOAL)
body += brand(70, 45, 1.25)
body += text('LANDING PAGE CONCEPTS / V1', 465, 111, 44, WHITE, 'bold', 1)
body += text('DESKTOP + MOBILE', 1940, 104, 22, GREEN, 'mono')
body += line(70, 154, 2330, 154)
concepts = [('01-armory-vault', '01 / ARMORY VAULT', 'Cinematic weapon vault + loadout preview.'), ('02-dossier-index', '02 / DOSSIER INDEX', 'Search-first archive + equipment dossiers.'), ('03-future-systems', '03 / FUTURE SYSTEMS', 'Research hangar + future-tech editorial.')]
for index, (name, title, description) in enumerate(concepts):
    x = 70 + index * 775
    body += text(title, x, 225, 32, WHITE, 'bold', .8)
    body += text(description, x, 262, 20, GRAY, 'body')
    body += include(f'{name}-desktop', x, 297, 705, 1600)
    body += rect(x, 297, 705, 440.625, 'none', METAL)
    body += text('DESKTOP / 1600 × 1000', x, 777, 18, GREEN, 'mono')
    body += include(f'{name}-mobile', x + 195, 819, 260, 430)
    body += rect(x + 195, 819, 260, 725.5814, 'none', METAL)
    body += text('MOBILE / 430 × 1200', x + 177, 1590, 18, GREEN, 'mono')
save('00-design-comparison', 2400, 1680, body, 'Weapon Database — Three Landing Concepts, Desktop and Mobile')
