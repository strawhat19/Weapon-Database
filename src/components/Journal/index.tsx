import Icon from '../Icon';
import './styles.scss';
import Modal from '../Modal';
import { useState } from 'react';
import { scrollToSection } from '../../shared/routes';
import { journalArticles, type JournalArticle } from './articles';

const Journal = () => {
  const [article, setArticle] = useState<JournalArticle | null>(null);
  return (
    <section id="journal" className="journal-section">
      <div id="journal-container" className="container journal-container">
        <div id="journal-heading" className="section-heading journal-heading">
          <div id="journal-heading-copy" className="journal-heading-copy"><p id="journal-eyebrow" className="eyebrow">Ideas Behind the Index</p><h2 id="journal-title" className="journal-title">From the Journal</h2></div>
          <p id="journal-introduction" className="journal-introduction">Notes on heritage, emerging systems, and the design choices that make an object worth studying.</p>
        </div>
        <div id="journal-grid" className="journal-grid">
          {journalArticles.map(entry => (
            <article id={`journal-card-${entry.id}`} key={entry.id} className={`journal-card${entry.id === `personal-configuration` ? ` journal-card--cutout` : ``}`}>
              <button type="button" id={`journal-image-button-${entry.id}`} className="journal-image-button" aria-label={`Read ${entry.title}`} onClick={() => setArticle(entry)}><img id={`journal-image-${entry.id}`} className="journal-image" src={entry.image} alt="" loading="lazy" /></button>
              <div id={`journal-content-${entry.id}`} className="journal-content"><p id={`journal-category-${entry.id}`} className="journal-category mono">{entry.category}</p><h3 id={`journal-card-title-${entry.id}`} className="journal-card-title"><button type="button" id={`journal-title-button-${entry.id}`} className="journal-title-button" onClick={() => setArticle(entry)}>{entry.title}</button></h3><p id={`journal-excerpt-${entry.id}`} className="journal-excerpt">{entry.excerpt}</p><button type="button" id={`journal-read-${entry.id}`} className="journal-read" onClick={() => setArticle(entry)}>Read the Note <Icon name="arrow" size={16} /></button></div>
            </article>
          ))}
        </div>
      </div>
      <Modal open={Boolean(article)} title={article?.title ?? `From the Journal`} eyebrow={article?.category} onClose={() => setArticle(null)}>
        {article && <div id={`journal-article-${article.id}`} className="journal-article"><p id={`journal-article-introduction-${article.id}`} className="journal-article-introduction">{article.excerpt}</p>{article.paragraphs.map((paragraph, index) => <p key={index} id={`journal-article-paragraph-${article.id}-${index}`} className="journal-article-paragraph">{paragraph}</p>)}{article.id === `personal-configuration` && <button type="button" id="journal-open-loadout" className="button button--quiet journal-article-action" onClick={() => { setArticle(null); scrollToSection(`loadout-lab`); }}><Icon name="sliders" size={16} />Explore the Loadout Lab</button>}</div>}
      </Modal>
    </section>
  );
};

export default Journal;
