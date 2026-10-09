const paths = {
  x: `M6 6L18 18M18 6L6 18`,
  plus: `M12 4V20M4 12H20`,
  play: `M8 5L19 12L8 19Z`,
  check: `M5 12L10 17L20 7`,
  pause: `M7 5H9V19H7ZM15 5H17V19H15Z`,
  rotate: `M4 9A8 8 0 1 1 4 16M4 3V9H10`,
  menu: `M3 6H21M3 12H21M3 18H21`,
  code: `M8 6L2 12L8 18M16 6L22 12L16 18M14 4L10 20`,
  mail: `M3 5H21V19H3ZM3 5L12 12L21 5`,
  info: `M21 12A9 9 0 1 1 3 12A9 9 0 1 1 21 12M12 7V7.5M12 11V17`,
  arrow: `M4 12H20M14 6L20 12L14 18`,
  chevron: `M9 5L16 12L9 19`,
  'arrow-up': `M12 20V4M6 10L12 4L18 10`,
  'chevron-up': `M5 15L12 8L19 15`,
  'chevron-left': `M15 5L8 12L15 19`,
  bookmark: `M6 3H18V22L12 17L6 22Z`,
  edit: `M14 4L20 10M3 21L5 14L16 3L21 8L10 19Z`,
  trash: `M3 6H21M9 6V3H15V6M5 6L6 21H18L19 6M10 10V17M14 10V17`,
  search: `M17 17L22 22M18 10A8 8 0 1 1 2 10A8 8 0 1 1 18 10`,
  moon: `M20 15A9 9 0 1 1 9 3A7 7 0 0 0 20 15Z`,
  book: `M3 3H9L12 6L15 3H21V21H15L12 23L9 21H3ZM12 6V23`,
  clock: `M21 12A9 9 0 1 1 3 12A9 9 0 1 1 21 12M12 6V12L17 15`,
  user: `M16 7A4 4 0 1 1 8 7A4 4 0 1 1 16 7M4 22V19C4 12 20 12 20 19V22`,
  sliders: `M3 6H21M3 12H21M3 18H21M8 3V9M16 9V15M8 15V21`,
  shield: `M12 2L21 6V12C21 17 17 21 12 23C7 21 3 17 3 12V6Z`,
  sun: `M16 12A4 4 0 1 1 8 12A4 4 0 1 1 16 12M12 1V4M12 20V23M1 12H4M20 12H23M4 4L6 6M18 18L20 20M4 20L6 18M18 6L20 4`,
};

export type IconName = keyof typeof paths;
const filledPaths: Partial<Record<IconName, string>> = {
  play: paths.play,
  pause: paths.pause,
  shield: paths.shield,
  info: `M12 2A10 10 0 1 1 12 22A10 10 0 1 1 12 2ZM11 10H13V17H11ZM11 6H13V8H11Z`,
  book: `M2 3H7C8.7 3 10 3.6 11 4.8V21C9.9 20.2 8.6 20 7 20H2ZM22 3H17C15.3 3 14 3.6 13 4.8V21C14.1 20.2 15.4 20 17 20H22Z`,
  code: `M8.4 4.8L1.2 12L8.4 19.2L10.1 17.5L4.6 12L10.1 6.5ZM15.6 4.8L13.9 6.5L19.4 12L13.9 17.5L15.6 19.2L22.8 12ZM13.3 3.5L8.5 20.5H10.9L15.7 3.5Z`,
  mail: `M4 4H20A2 2 0 0 1 22 6V18A2 2 0 0 1 20 20H4A2 2 0 0 1 2 18V6A2 2 0 0 1 4 4ZM4 6L12 12L20 6V8L12 14L4 8Z`,
};
type IconProps = { name: IconName; size?: number; filled?: boolean; className?: string };

export default function Icon({ name, size = 22, filled = false, className = `` }: IconProps) {
  const filledPath = filled ? filledPaths[name] : undefined;
  return <svg aria-hidden={true} focusable={false} viewBox={`0 0 24 24`} width={size} height={size} className={`icon ${className}`}>
    <path d={filledPath ?? paths[name]} fill={filledPath ? `currentColor` : `none`} stroke={filledPath ? `none` : `currentColor`} fillRule={`evenodd`} strokeWidth={1.65} strokeLinecap={`square`} strokeLinejoin={`miter`} />
  </svg>;
}
