import Icon from '../Icon';
import type { Category } from '../../types/types';
import { categories } from '../../shared/catalog';
import { scrollToSection } from '../../shared/routes';
import { useArmory } from '../../shared/armoryContext';

const indexCategories = categories.filter(category => category.id !== `all`);

export default function CategoryIndex() {
  const { setCategory, setQuery } = useArmory();
  const openCategory = (category: Category) => { setCategory(category); setQuery(``); scrollToSection(`catalog`); };
  return <section id={`archive-index`} className={`archive-index container`} aria-labelledby={`archive-index-label`}>
    <p id={`archive-index-label`} className={`eyebrow`}>Explore The Index</p>
    <div className={`archive-index__row`}>
      <div className={`archive-index__categories`}>
        {indexCategories.map((category, index) => <button type={`button`} id={`archive-index-${category.id}`} className={`archive-index__category`} key={category.id} onClick={() => openCategory(category.id)}>
          <span className={`archive-index__number mono`}>{String(index + 1).padStart(2, `0`)}</span>
          <span id={`archive-index-copy-${category.id}`} className={`archive-index__copy`}>
            <strong id={`archive-index-title-${category.id}`} className={`archive-index__title`}><Icon name={category.id} size={20} className={`archive-index__icon`} /><span>{category.label}</span></strong>
            <small id={`archive-index-subtitle-${category.id}`}>{category.subtitle}</small>
          </span>
        </button>)}
      </div>
      <button type={`button`} id={`archive-index-field-notes`} className={`archive-index__journal`} onClick={() => scrollToSection(`journal`)}>
        <span><small className={`eyebrow`}>Field Notes / Journal + History</small><strong>Weapons. Warfare.</strong><span>What comes next.</span></span>
        <Icon name={`arrow`} size={26} />
      </button>
    </div>
  </section>;
}
