import Icon from '../Icon';
import { scrollToSection } from '../../shared/routes';
import { useArmory } from '../../shared/armoryContext';
import type { Category } from '../../types/types';

const categories: { id: Category; title: string; subtitle: string }[] = [
  { id: `firearms`, title: `Firearms`, subtitle: `Rifles / Sidearms` },
  { id: `swords`, title: `Swords`, subtitle: `Blades / Heritage` },
  { id: `drones`, title: `Drones`, subtitle: `Air / Autonomous` },
  { id: `future`, title: `Future Tech`, subtitle: `Research / Systems` },
];

export default function CategoryIndex() {
  const { setCategory, setQuery } = useArmory();
  const openCategory = (category: Category) => { setCategory(category); setQuery(``); scrollToSection(`catalog`); };
  return <section id={`archive-index`} className={`archive-index container`} aria-labelledby={`archive-index-label`}>
    <p id={`archive-index-label`} className={`eyebrow`}>Explore The Index</p>
    <div className={`archive-index__row`}>
      <div className={`archive-index__categories`}>
        {categories.map((category, index) => <button type={`button`} id={`archive-index-${category.id}`} className={`archive-index__category`} key={category.id} onClick={() => openCategory(category.id)}>
          <span className={`archive-index__number mono`}>{String(index + 1).padStart(2, `0`)}</span>
          <span><strong>{category.title}</strong><small>{category.subtitle}</small></span>
        </button>)}
      </div>
      <button type={`button`} id={`archive-index-field-notes`} className={`archive-index__journal`} onClick={() => scrollToSection(`journal`)}>
        <span><small className={`eyebrow`}>Field Notes / Journal + History</small><strong>Weapons. Warfare.</strong><span>What comes next.</span></span>
        <Icon name={`arrow`} size={26} />
      </button>
    </div>
  </section>;
}
