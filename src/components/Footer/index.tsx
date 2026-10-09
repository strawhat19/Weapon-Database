import Icon from '../Icon';
import './styles.scss';
import Brand from '../Brand';

export type FooterTopic = `about` | `contact` | `terms` | `privacy`;
type FooterProps = { onOpenInfo: (topic: FooterTopic) => void };
const footerTopics: { id: FooterTopic; label: string }[] = [
  { id: `about`, label: `About` },
  { id: `terms`, label: `Terms` },
  { id: `privacy`, label: `Privacy` },
  { id: `contact`, label: `Contact` }
];

const Footer = ({ onOpenInfo }: FooterProps) => (
  <footer id="site-footer" className="site-footer">
    <div id="footer-container" className="container footer-container">
      <div id="footer-main" className="footer-main"><div id="footer-identity" className="footer-identity"><Brand id="footer-brand" compact /><p id="footer-description" className="footer-description">A considered collection of models, stories, and possibilities.</p></div><div id="footer-archive-note" className="footer-archive-note"><span id="footer-archive-label" className="footer-archive-label mono"><Icon name="shield" size={14} />The Weapon Archive</span><p id="footer-archive-copy" className="footer-archive-copy">Explore the details.<br />Keep the perspective.</p></div></div>
      <div id="footer-bottom" className="footer-bottom"><p id="footer-copyright" className="footer-copyright">© {new Date().getFullYear()} Weapon Database</p><nav id="footer-info-nav" className="footer-info-nav" aria-label="Information">{footerTopics.map(topic => <button type="button" key={topic.id} id={`footer-info-${topic.id}`} className="footer-info-link" onClick={() => onOpenInfo(topic.id)}>{topic.label}</button>)}</nav><a id="footer-piratechs" className="footer-piratechs" href="https://piratechs.com/" target="_blank" rel="noopener noreferrer">Piratechs <Icon name="arrow" size={13} /></a></div>
    </div>
  </footer>
);

export default Footer;
