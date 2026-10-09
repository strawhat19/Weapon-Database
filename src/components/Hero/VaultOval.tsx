import { useId } from 'react';

type VaultOvalProps = { dark: boolean };

const ovalArc = (start: number, end: number) => {
  const first = start * Math.PI / 180;
  const last = end * Math.PI / 180;
  return `M${379 * Math.cos(first)} ${379 * Math.sin(first)}A379 379 0 0 1 ${379 * Math.cos(last)} ${379 * Math.sin(last)}`;
};

const VaultOval = ({ dark }: VaultOvalProps) => {
  const identity = useId().replace(/:/g, ``);
  const rimId = `hero-vault-rim-${identity}`;
  const recessId = `hero-vault-recess-${identity}`;
  const green = dark ? `#81BC34` : `#375540`;

  return (
    <svg
      aria-hidden={true}
      viewBox={`0 0 787 450`}
      className={`hero-vault-oval`}
      id={`hero-vault-oval-${identity}`}
    >
      <defs>
        <linearGradient id={rimId} x1={0} y1={0} x2={0.25} y2={1}>
          <stop stopColor={`#859398`} />
          <stop offset={0.25} stopColor={`#565B64`} />
          <stop offset={0.52} stopColor={`#020302`} />
          <stop offset={0.78} stopColor={`#859398`} />
          <stop offset={1} stopColor={`#565B64`} />
        </linearGradient>
        <radialGradient id={recessId}>
          <stop offset={0.5} stopOpacity={0} stopColor={`#020302`} />
          <stop offset={1} stopColor={`#020302`} stopOpacity={dark ? 0.18 : 0.035} />
        </radialGradient>
      </defs>
      <g transform={`translate(394 231)`}>
        <g className={`hero-vault-oval__rotation`}>
          <ellipse rx={388} ry={169} fill={`url(#${recessId})`} />
          <ellipse rx={388} ry={169} fill={`none`} strokeWidth={1} stroke={`#565B64`} opacity={dark ? 0.25 : 0.22} />
          <ellipse rx={379} ry={160} fill={`none`} strokeWidth={12} stroke={`url(#${rimId})`} opacity={dark ? 0.36 : 0.31} />
          <ellipse rx={371} ry={152} fill={`none`} strokeWidth={2} stroke={`#020302`} opacity={dark ? 0.7 : 0.19} />
          <ellipse rx={366} ry={147} fill={`none`} strokeWidth={0.7} stroke={`#859398`} opacity={dark ? 0.12 : 0.15} />
          <g transform={`scale(1 ${160 / 379})`}>
            <g className={`hero-vault-oval__orbit`}>
              {([[204, 216], [24, 36]] as const).map(([start, end], index) => (
                <path
                  fill={`none`}
                  stroke={green}
                  strokeWidth={2}
                  key={`${start}-${end}`}
                  d={ovalArc(start, end)}
                  opacity={dark ? 0.4 : 0.29}
                  vectorEffect={`non-scaling-stroke`}
                  className={`hero-vault-oval__orbit-accent`}
                  id={`${identity}-vault-accent-${index}`}
                />
              ))}
              {([[58, 68], [112, 122], [238, 248], [292, 302]] as const).map(([start, end], index) => (
                <path
                  fill={`none`}
                  strokeWidth={5}
                  stroke={`#020302`}
                  key={`${start}-${end}`}
                  d={ovalArc(start, end)}
                  opacity={dark ? 0.64 : 0.27}
                  vectorEffect={`non-scaling-stroke`}
                  className={`hero-vault-oval__orbit-slot`}
                  id={`${identity}-vault-rim-slot-${index}`}
                />
              ))}
              {[44, 224].map((position, index) => (
                <g key={position} id={`${identity}-vault-fastener-${index}`} opacity={dark ? 0.65 : 0.35}>
                  <path d={ovalArc(position, position + 0.001)} fill={`none`} stroke={`#020302`} strokeWidth={7} strokeLinecap={`round`} vectorEffect={`non-scaling-stroke`} className={`hero-vault-oval__fastener-edge`} />
                  <path d={ovalArc(position, position + 0.001)} fill={`none`} stroke={`#375540`} strokeWidth={5} strokeLinecap={`round`} vectorEffect={`non-scaling-stroke`} className={`hero-vault-oval__fastener-face`} />
                </g>
              ))}
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default VaultOval;
