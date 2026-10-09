import Icon from '../Icon';
import './styles.scss';
import { useArmory } from '../../shared/armoryContext';
import { scrollToSection } from '../../shared/routes';

const archiveChapters = [
  { id: `blade-heritage`, title: `Blade Heritage`, category: `swords`, label: `Form & Craft`, description: `A closer look at blade silhouettes, proportions, and the questions behind a historical reference.` },
  { id: `industrial-forms`, title: `Industrial Forms`, category: `firearms`, label: `Material & Mechanism`, description: `An equipment index organized around recognizable shapes, visible details, and their design context.` },
  { id: `modular-studies`, title: `Modular Studies`, category: `firearms`, label: `Configuration & Identity`, description: `Visual studies that explore finish, accessories, and the relationship between a whole and its parts.` },
  { id: `emerging-systems`, title: `Emerging Systems`, category: `future`, label: `Concept & Possibility`, description: `A separate space for drones and future concepts, with illustrations distinguished from documented examples.` }
] as const;

const ArchiveTimeline = () => {
  const { setCategory, setQuery } = useArmory();
  const openChapter = (category: typeof archiveChapters[number][`category`]) => { setCategory(category); setQuery(``); scrollToSection(`catalog`); };
  return (
    <section id="history" className="archive-section">
      <div id="archive-container" className="container archive-container">
        <div id="archive-heading" className="section-heading archive-heading"><div id="archive-heading-copy" className="archive-heading-copy"><p id="archive-eyebrow" className="eyebrow">The Wider Perspective</p><h2 id="archive-title" className="archive-title">Across Form and Era</h2></div><p id="archive-introduction" className="archive-introduction">An editorial route through the collection, from blade references to contemporary design studies and emerging ideas.</p></div>
        <ol id="archive-timeline" className="archive-timeline">
          {archiveChapters.map((chapter, index) => (
            <li id={`archive-chapter-${chapter.id}`} key={chapter.id} className="archive-chapter"><div id={`archive-chapter-marker-${chapter.id}`} className="archive-chapter-marker"><span id={`archive-chapter-number-${chapter.id}`} className="archive-chapter-number mono">{String(index + 1).padStart(2, `0`)}</span><span id={`archive-chapter-dot-${chapter.id}`} className="archive-chapter-dot" /></div><p id={`archive-chapter-label-${chapter.id}`} className="archive-chapter-label mono">{chapter.label}</p><h3 id={`archive-chapter-title-${chapter.id}`} className="archive-chapter-title">{chapter.title}</h3><p id={`archive-chapter-copy-${chapter.id}`} className="archive-chapter-copy">{chapter.description}</p><button type="button" id={`archive-chapter-open-${chapter.id}`} className="archive-chapter-open" onClick={() => openChapter(chapter.category)}>Explore Chapter <Icon name="arrow" size={15} /></button></li>
          ))}
        </ol>
        <div id="archive-closing" className="archive-closing"><Icon name="book" size={20} /><p id="archive-closing-copy">An archive keeps growing. Start with an object, then follow the questions it raises.</p><button type="button" id="archive-open-catalog" className="button button--quiet" onClick={() => { setQuery(``); setCategory(`all`); scrollToSection(`catalog`); }}>Return to the Collection <Icon name="arrow" size={16} /></button></div>
      </div>
    </section>
  );
};

export default ArchiveTimeline;
