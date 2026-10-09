import Icon from '../Icon';
import './styles.scss';
import Brand from '../Brand';
import useHeader from './useHeader';
import { useTheme } from '../../shared/themeContext';
import { menuLinks, scrollToSection, type InfoTopic, type SectionId } from '../../shared/routes';

type HeaderProps = { sticky?: boolean; onOpenAccount: () => void; onOpenInfo: (topic: InfoTopic) => void };

const Header = ({ sticky = true, onOpenAccount, onOpenInfo }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { scrolled, menuOpen, activeSection, menuButtonRef, closeMenu, setMenuOpen, setActiveSection } = useHeader();
  const navigate = (section: SectionId) => { setActiveSection(section); closeMenu(); scrollToSection(section); };
  const openMenuLink = (link: (typeof menuLinks)[number]) => { closeMenu(); if (link.section) navigate(link.section); else if (link.topic) onOpenInfo(link.topic); };
  const openAccount = () => { closeMenu(); onOpenAccount(); };
  return (
    <header id="site-header" className={`site-header${sticky ? ` is-sticky` : ``}${scrolled ? ` is-scrolled` : ``}${menuOpen ? ` is-menu-open` : ``}`}>
      <div id="header-utility" className="header-utility"><div id="header-utility-container" className="container header-utility-container"><span id="header-utility-identity" className="header-utility-identity mono"><span className="header-utility-dot" />The Weapon Archive <span className="header-utility-divider">/</span> Weapon Database</span><span id="header-utility-description" className="header-utility-description mono">Models. Stories. Possibilities.</span></div></div>
      <div id="header-main" className="container header-main">
        <Brand id="header-brand" onNavigate={() => { closeMenu(); setActiveSection(`hero`); }} />
        <nav id={`header-desktop-nav`} className={`header-desktop-nav`} aria-label={`Main navigation`}>
          {menuLinks.map(link => <button
            type={`button`}
            key={link.id}
            id={`header-nav-${link.id}`}
            onClick={() => openMenuLink(link)}
            aria-current={activeSection === link.section ? `location` : undefined}
            className={`header-nav-link${activeSection === link.section ? ` is-active` : ``}`}
          ><Icon filled name={link.icon} size={15} className={`header-link-icon`} /><span id={`header-nav-label-${link.id}`}>{link.label}</span></button>)}
        </nav>
        <div id="header-actions" className="header-actions">
          <button
            type={`button`}
            onClick={toggleTheme}
            id={`header-theme-toggle`}
            className={`header-theme-toggle`}
            title={`Switch to ${theme === `dark` ? `light` : `dark`} theme`}
            aria-label={`Switch to ${theme === `dark` ? `light` : `dark`} theme`}
          ><Icon name={theme === `dark` ? `sun` : `moon`} size={15} /></button>
          <button type="button" id="header-sign-in" className="header-sign-in" onClick={openAccount}><Icon name="user" size={15} />Sign In</button>
          <button type="button" id="header-menu-toggle" ref={menuButtonRef} className="icon-button header-menu-toggle" aria-label={menuOpen ? `Close navigation` : `Open navigation`} aria-expanded={menuOpen} aria-controls="header-mobile-menu" onClick={() => setMenuOpen(current => !current)}><Icon name={menuOpen ? `x` : `menu`} size={21} /></button>
        </div>
      </div>
      {menuOpen && <div id={`header-mobile-menu`} className={`header-mobile-menu`}>
        <nav id={`header-mobile-nav`} className={`container header-mobile-nav`} aria-label={`Mobile navigation`}>
          {menuLinks.map(link => <button
            type={`button`}
            key={link.id}
            id={`header-mobile-nav-${link.id}`}
            onClick={() => openMenuLink(link)}
            aria-current={activeSection === link.section ? `location` : undefined}
            className={`header-mobile-link${activeSection === link.section ? ` is-active` : ``}`}
          ><span className={`header-mobile-link-content`}><Icon filled name={link.icon} size={19} className={`header-link-icon`} /><span id={`header-mobile-nav-label-${link.id}`}>{link.label}</span></span><Icon name={`arrow`} size={16} /></button>)}
          <div id={`header-mobile-account-actions`} className={`header-mobile-account-actions`}>
            <button type={`button`} id={`header-mobile-sign-in`} className={`button button--quiet`} onClick={openAccount}><Icon name={`user`} size={16} />Sign In</button>
          </div>
        </nav>
      </div>}
    </header>
  );
};

export default Header;
