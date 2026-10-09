export type JournalArticle = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  imagePosition?: string;
  paragraphs: string[];
};

export const journalArticles: JournalArticle[] = [
  {
    id: `blade-and-context`,
    category: `Archive Notes`,
    title: `A Blade Is More Than Its Silhouette`,
    excerpt: `A closer look begins with context, craftsmanship, and the questions an archive should ask.`,
    image: assetUrl(`images/heritage-blade.png`),
    paragraphs: [
      `A useful weapon archive invites more than a glance at a silhouette. It provides room for questions about form, materials, provenance, and the setting in which an object belongs.`,
      `The heritage blade entry is a visual reference for this collection. Its place in the index is an invitation to examine the proportions and details, rather than a claim about the origin of a particular historical artifact.`,
      `As the archive develops, historical entries should distinguish documented examples from illustrations and design studies. Keeping that distinction visible makes comparisons more meaningful.`
    ]
  },
  {
    id: `emerging-systems`,
    category: `Future Systems`,
    title: `Give the Future Its Own Dossier`,
    excerpt: `Emerging ideas deserve a clear place beside the archive, with concepts presented as concepts.`,
    image: assetUrl(`images/future-drone.png`),
    paragraphs: [
      `The Future Systems collection offers a place for visual studies of emerging equipment. It sits beside the historical reference collection while retaining its own identity and labels.`,
      `The drone imagery in this collection represents a design study. The illustrations are intended to support discussion of appearance and design direction; they do not establish operational capabilities or specifications.`,
      `Separating a concept from a documented system helps an archive remain useful as it grows. The same principle applies to model names, imagery, and the details attached to each entry.`
    ]
  },
  {
    id: `personal-configuration`,
    category: `Design Journal`,
    title: `Make a Configuration Your Own`,
    excerpt: `Explore finish, shape, and visual balance in the Loadout Lab, then keep the combinations you like.`,
    image: assetUrl(`images/armory-rifle.png`),
    paragraphs: [
      `The Loadout Lab is a visual workspace for exploring a personal configuration. Start with a collection entry, select a finish, and choose the optic and accessory labels that suit your study.`,
      `The finish preview illustrates a color treatment. The choices in the editor describe your saved concept and do not establish real-world fit or compatibility.`,
      `Give each combination a name and save it to this browser. You can return to a saved configuration, revise its selections, or remove it when your design direction changes.`
    ]
  }
];
import { assetUrl } from '../../shared/assets';
