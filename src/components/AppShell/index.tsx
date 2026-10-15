import Icon from '../Icon';
import { router } from 'expo-router';
import Hero from '../Hero';
import Modal from '../Modal';
import Header from '../Header';
import Footer from '../Footer';
import Journal from '../Journal';
import Catalog from '../Catalog';
import LoadoutLab from '../LoadoutLab';
import { type CSSProperties } from 'react';
import { useAppShell } from './useAppShell';
import CategoryIndex from '../CategoryIndex';
import { assetUrl } from '../../shared/assets';
import ArchiveTimeline from '../ArchiveTimeline';
import { useTheme } from '../../shared/themeContext';
import { useArmory } from '../../shared/armoryContext';
import SavedConfigurations from '../SavedConfigurations';
import { scrollToTop, scrollToSection } from '../../shared/routes';

const information = {
  about: { title: `The public armory.`, copy: `Weapon Database is an archive for exploring weapon design, heritage, and emerging systems. This preview collection combines design studies with editorial reference content. Build a collection, compare forms, and create your own visual loadouts.` },
  api: { title: `The Weapon Database API.`, copy: `A public API is planned for the archive. This frontend preview uses a local sample collection; public endpoints and API access are not available yet.` },
  terms: { title: `Reference, not instruction.`, copy: `This preview is for design exploration and general reference. Featured concepts and visual configurations are illustrative; they are not products for sale, technical specifications, or guidance for building or using weapons.` },
  privacy: { title: `Your collection stays with you.`, copy: `Saved weapons, loadouts, and theme preferences are stored on this device. There are no connected accounts, analytics, or cloud database in this version. Clearing your browser’s site data removes your collection. Cloud sync is not available yet.` },
  contact: { title: `Built by Piratechs.`, copy: `Have a thought about the archive or a future collaboration? Visit Piratechs to learn more about the team behind Weapon Database.` },
};

export default function AppShell({ page = `home` }: { page?: `home` | `weapons` }) {
  const state = useAppShell();
  const { error: themeError, dismissError: dismissThemeError } = useTheme();
  const { busy, weapons, savedWeaponIds, toggleSavedWeapon, selectWeaponForBuild, error, notice, dismissError, dismissNotice, loading } = useArmory();
  const selectedWeapon = weapons.find(weapon => weapon.id === state.weaponId);
  const savedWeapons = weapons.filter(weapon => savedWeaponIds.includes(weapon.id));
  const info = state.infoTopic ? information[state.infoTopic] : null;
  const materialStyles = {
    '--dark-steel': `url("${assetUrl(`textures/dark-brushed-steel.png`)}")`,
    '--light-steel': `url("${assetUrl(`textures/light-brushed-steel.png`)}")`,
    '--brand-wordmark': `url("${assetUrl(`brand/wordmark.svg`)}")`,
  } as CSSProperties;
  const openBuild = (id: string) => { selectWeaponForBuild(id); state.setWeaponId(null); scrollToSection(`loadout-lab`); };
  return <div id={`weapon-database-app`} className={`armory-app`} style={materialStyles}>
    <a className={`skip-link`} href={`#catalog`} onClick={event => { event.preventDefault(); scrollToSection(`catalog`); }}>Skip To The Catalog</a>
    <Header onOpenInfo={topic => router.push(`/${topic}`)} onOpenAccount={() => router.push(`/signin`)} />
    <main id={`armory-main`}>
      {page === `home` ? <><Hero onOpenWeapon={state.setWeaponId} /><CategoryIndex /></> : <>
        <div id={`weapons-page-heading`} className={`container weapons-page-heading`}><p className={`eyebrow`}>Your Armory</p><h1 id={`weapons-page-title`}>Weapons</h1></div>
        <SavedConfigurations onEdit={() => scrollToSection(`loadout-lab`)} />
      </>}
      <Catalog key={page} defaultCategory={page === `weapons` ? `all` : `firearms`} onOpenWeapon={state.setWeaponId} />
      {page === `home` && <><LoadoutLab /><Journal /><ArchiveTimeline /></>}
    </main>
    <Footer onOpenInfo={topic => router.push(`/${topic}`)} />
    <button type={`button`} id={`scroll-to-top`} className={`scroll-top ${state.pastHero ? `scroll-top--visible` : ``}`} aria-label={`Scroll To Top`} tabIndex={state.pastHero ? 0 : -1} onClick={scrollToTop}><Icon name={`chevron-up`} /></button>
    {(error || themeError) && <div id={`storage-error-notice`} role={`alert`} className={`app-feedback app-feedback--error`}>
      <p>{error || themeError}</p><button type={`button`} className={`icon-button`} id={`dismiss-storage-error`} aria-label={`Dismiss Message`} onClick={() => { dismissError(); dismissThemeError(); }}><Icon name={`x`} size={18} /></button>
    </div>}
    {notice && !error && <div id={`armory-toast`} className={`app-feedback`} role={`status`}>
      <Icon name={`check`} size={18} /><p>{notice}</p><button type={`button`} className={`icon-button`} id={`dismiss-armory-notice`} aria-label={`Dismiss Message`} onClick={dismissNotice}><Icon name={`x`} size={18} /></button>
    </div>}
    <Modal open={Boolean(selectedWeapon)} title={selectedWeapon?.title ?? `Weapon Dossier`} eyebrow={`ARCHIVE / REFERENCE PLATE`} onClose={() => state.setWeaponId(null)}>
      {selectedWeapon && <div id={`weapon-dossier-${selectedWeapon.id}`} className={`weapon-dossier`}>
        <div className={`weapon-dossier__image ${selectedWeapon.imageStyle === `photograph` ? `weapon-dossier__image--photo` : ``}`}><img src={selectedWeapon.image} alt={selectedWeapon.title} /></div>
        <p className={`eyebrow`}>{selectedWeapon.subtitle} / {selectedWeapon.isConcept ? `Design Study` : `Reference Study`}</p>
        <p>{selectedWeapon.description}</p>
        <dl className={`weapon-dossier__facts`}>{selectedWeapon.stats.map((stat, index) => <div id={`weapon-dossier-stat-${selectedWeapon.id}-${index}`} key={stat.label}><dt className={`eyebrow`}>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl>
        <div className={`weapon-dossier__actions`}>
          <button type={`button`} disabled={busy} id={`dossier-save-${selectedWeapon.id}`} className={`button button--quiet`} onClick={() => { void toggleSavedWeapon(selectedWeapon.id); }}><Icon name={savedWeaponIds.includes(selectedWeapon.id) ? `check` : `bookmark`} />{savedWeaponIds.includes(selectedWeapon.id) ? `Saved To Armory` : `Save Weapon`}</button>
          {selectedWeapon.modelId && <button type={`button`} id={`dossier-build-${selectedWeapon.id}`} className={`button button--primary`} onClick={() => openBuild(selectedWeapon.id)}><Icon name={`sliders`} />Build A Loadout</button>}
        </div>
      </div>}
    </Modal>
    <Modal open={state.armoryOpen} title={`Your saved armory.`} eyebrow={`COLLECTION / ON THIS DEVICE`} onClose={() => state.setArmoryOpen(false)}>
      <div id={`saved-armory-list`} className={`saved-armory`}>
        {loading ? <p>Opening your collection…</p> : savedWeapons.length ? savedWeapons.map(weapon => <div id={`saved-armory-${weapon.id}`} className={`saved-armory__item`} key={weapon.id}>
          <button type={`button`} id={`saved-armory-open-${weapon.id}`} className={`saved-armory__open`} onClick={() => { state.setArmoryOpen(false); state.setWeaponId(weapon.id); }}><img src={weapon.image} alt={``} /><span><strong>{weapon.title}</strong><small>{weapon.subtitle}</small></span><Icon name={`arrow`} size={18} /></button>
          <button type={`button`} disabled={busy} id={`saved-armory-remove-${weapon.id}`} className={`icon-button`} aria-label={`Remove ${weapon.title} From Saved Items`} onClick={() => { void toggleSavedWeapon(weapon.id); }}><Icon name={`x`} size={18} /></button>
        </div>) : <div className={`empty-state`}><Icon name={`bookmark`} size={28} /><p>Your armory is waiting.<br />Save a weapon from the catalog to start your collection.</p></div>}
        <p className={`saved-armory__note`}>Your saved weapons stay on this device.</p>
        <button type={`button`} id={`saved-armory-explore`} className={`button button--quiet`} onClick={() => { state.setArmoryOpen(false); scrollToSection(`catalog`); }}><Icon name={`shield`} />Explore The Catalog</button>
      </div>
    </Modal>
    <Modal open={state.accountOpen} title={`Make it your armory.`} eyebrow={`A PERSONAL COLLECTION`} onClose={() => state.setAccountOpen(false)}>
      <div className={`account-preview`} id={`account-preview`}>
        <Icon name={`shield`} size={42} /><p>Save the designs that catch your eye. Give your loadouts a name. Keep your own corner of the archive.</p>
        <p>Cloud accounts are coming. For now, your collection and builds are saved on this device, without an account.</p>
        <button type={`button`} id={`continue-on-device`} className={`button button--primary`} onClick={() => { state.setAccountOpen(false); state.setArmoryOpen(true); }}><Icon name={`bookmark`} />Continue On This Device</button>
      </div>
    </Modal>
    <Modal open={Boolean(info)} title={info?.title ?? ``} onClose={() => state.setInfoTopic(null)}>
      {info && <div id={`footer-info-${state.infoTopic}`}><p>{info.copy}</p>{state.infoTopic === `contact` && <a className={`button button--quiet`} href={`https://piratechs.com/`} target={`_blank`} rel={`noopener noreferrer`}><Icon name={`arrow`} />Visit Piratechs</a>}</div>}
    </Modal>
  </div>;
}
