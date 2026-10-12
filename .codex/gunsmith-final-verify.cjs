const fs = require('node:fs');
const { chromium } = require('C:/Users/massa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }).catch(() => chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }));
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
    const errors = [], missing = [], checks = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) missing.push({ status: response.status(), url: response.url() }); });
    const check = (name, result) => { if (!result) throw new Error(name); checks.push(name); process.stdout.write(name + '\n'); };
    const ready = async () => page.locator('#loadout-weapon-model[data-state="ready"]').waitFor({ timeout: 45000 });
    await page.goto('https://weapon-database.vercel.app', { waitUntil: 'networkidle', timeout: 90000 });
    await page.locator('#loadout-lab').scrollIntoViewIfNeeded();
    await ready();
    const textureUrls = await page.locator('#weapon-database-app').evaluate(el => ['--light-steel', '--dark-steel'].map(name => getComputedStyle(el).getPropertyValue(name)));
    check('Production Texture URLs Use Public Root', textureUrls.every(value => value.includes('"/media/textures/')));
    await page.getByRole('button', { name: /Switch.*(Dark|Light)/i }).click();
    await page.waitForLoadState('networkidle');
    check('Both Themes Load Without Missing Resources', missing.length === 0);
    await page.getByRole('button', { name: /Switch.*(Dark|Light)/i }).click();
    await page.locator('#gunsmith-reset').click();
    for (const [slot,id] of [['optic','precision'],['muzzle','suppressor'],['underbarrel','grip'],['rail','light'],['stock','cheek-rest'],['magazine','extended']]) {
      await page.locator('#gunsmith-slot-' + slot).click();
      await page.locator('#gunsmith-equip-' + slot + '-' + id).click();
      await ready();
    }
    check('Six Mounted Parts Render On Production', (await page.locator('#gunsmith-count').innerText()).startsWith('6 / 6'));
    const configuration = await page.locator('#loadout-weapon-model').getAttribute('data-equipment');
    await page.locator('#loadout-lab').scrollIntoViewIfNeeded();
    await page.locator('#loadout-preview').screenshot({ path: '.codex/gunsmith-final-mounted.png', animations: 'disabled' });
    await page.locator('#gunsmith-slot-optic').click();
    await page.locator('#gunsmith-inspect-optic-reflex').click();
    await page.locator('#gunsmith-part-model[data-state="ready"]').waitFor({ timeout: 30000 });
    await page.locator('#gunsmith-inspector').screenshot({ path: '.codex/gunsmith-final-reflex.png', animations: 'disabled' });
    check('Isolated Reflex With Glass And Reticle Renders', await page.locator('#gunsmith-part-model-viewport canvas').count() === 1);
    await page.locator('#gunsmith-inspector-close').click();
    await page.locator('#loadout-name-input').fill('Published Gunsmith Check');
    await page.locator('#loadout-save').click();
    await page.locator('.saved-loadout').waitFor();
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('.saved-loadout-action').first().click();
    await ready();
    check('Published Saved Build Restores All Slots', (await page.locator('#loadout-weapon-model').getAttribute('data-equipment')) === configuration);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#loadout-lab').scrollIntoViewIfNeeded();
    await page.locator('#loadout-preview').screenshot({ path: '.codex/gunsmith-final-mobile.png', animations: 'disabled' });
    check('Mobile Layout Fits Screen', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    const result = { url: page.url(), textureUrls, configuration, checks, errors, missing };
    fs.writeFileSync('.codex/gunsmith-final-verification.json', JSON.stringify(result, null, 2));
    process.stdout.write(JSON.stringify(result) + '\n');
    check('No Production Console Or Resource Errors', errors.length === 0 && missing.length === 0);
  } finally { await browser.close(); }
})().catch(error => { process.stderr.write(error.stack + '\n'); process.exit(1); });
