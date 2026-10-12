import type { EquipmentIllustration } from '../../types/types';

const silhouettes: Record<EquipmentIllustration, string> = {
  none: `M68 50a22 22 0 1 0 44 0a22 22 0 1 0-44 0M75 35l30 30`,
  iron: `M35 66h32V53H54V34H45v19H35Zm81 0h29V53h-10V36h-9v17h-10Z`,
  reflex: `M55 72h65v-9H58ZM70 63V28h43v35h-8V36H78v27Zm-12-6h24v6H58Z`,
  scope: `M26 40h20v-8h28v10h57V29h26v43h-26V59H74v10H46v-8H26ZM81 42V30h15v12M84 59v13h-7v6h38v-6h-7V59`,
  suppressor: `M27 41h18v-8h99l12 8v20l-12 8H45v-8H27ZM52 33v36M136 33v36M63 41h62M63 60h62`,
  brake: `M38 41h24v-8h69l12 10v17l-12 9H62v-8H38ZM77 38v26M93 38v26M110 38v26`,
  grip: `M64 24h52v10H99l9 37-7 14H79l-7-14 9-37H64ZM78 48h23M80 58h24M80 69h25`,
  bipod: `M67 24h46v10H94l34 45h12v6h-26L89 46 63 85H39v-6h12l34-45H67Z`,
  light: `M43 39h88l10 10v17H43ZM68 39V29h35v10M128 39v27M56 43v18M141 43h10v18h-10`,
  stock: `M32 57l13-23h84l17 10-5 18H46ZM49 34v28M67 62v14h13V62M117 62v14h13V62`,
  magazine: `M64 24h38l20 51-7 8H77L61 37ZM71 40h35M77 54h35M83 68h35M73 82h49v7H73Z`,
  scabbard: `M32 65l111-32 10 5-112 33-11-1ZM139 33l5 12M47 61l3 7`,
  tassel: `M58 24q52 0 52 21q0 14-24 13M76 58h20v9H76ZM78 67l-9 25M83 67l-2 25M90 67l3 25M95 67l9 25`,
  guard: `M38 65q15-35 47-15V23h11v27q32-20 47 15l-10 9q-22-22-38-10H85Q69 52 47 74Z`,
  camera: `M63 28h55v10H91v8M54 46h66l11 15-11 20H54l-10-20ZM74 61a14 14 0 1 0 28 0a14 14 0 1 0-28 0`,
  cargo: `M42 35h99v47H42ZM61 35v47M120 35v47M76 35V24h29v11M44 58h95`,
  landing: `M47 30h90M65 30v43M119 30v43M42 78h46l8-8M101 78h45l8-8`,
};
const PartIllustration = ({ id, illustration }: { id: string; illustration: EquipmentIllustration }) => (
  <svg id={id} className={`part-illustration part-illustration--${illustration}`} viewBox={`0 0 180 110`} aria-hidden={true} focusable={false}>
    <path id={`${id}-shadow`} d={silhouettes[illustration]} transform={`translate(4 5)`} stroke={`var(--rule)`} strokeWidth={5} fill={`none`} strokeLinejoin={`round`} />
    <path id={`${id}-shape`} d={silhouettes[illustration]} stroke={`currentColor`} strokeWidth={2.3} fill={illustration === `none` ? `none` : `var(--surface-deep)`} fillRule={`evenodd`} strokeLinejoin={`round`} />
  </svg>
);
export default PartIllustration;
