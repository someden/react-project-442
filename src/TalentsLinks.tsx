import {
  TALENT_CELL_HEIGHT,
  TALENT_CELL_WIDTH,
  TIER_LABEL_TEXT,
  TIER_LABEL_WIDTH,
  centerX,
  centerY,
  gridHeight,
  gridWidth,
  tierY,
} from "./grid";
import type { Talent, Tree } from "./types";

const edgesFor = (from: Talent, to: Talent) => {
  const [x1, y1] = [centerX(from.col), centerY(from.row)];
  const [x2, y2] = [centerX(to.col), centerY(to.row)];

  if (from.row === to.row) {
    const side = x1 < x2 ? 1 : -1;
    return { x1: x1 + side * TALENT_CELL_WIDTH / 2, x2: x2 - side * TALENT_CELL_WIDTH / 2, y1, y2 };
  }

  return { x1, x2, y1: y1 + TALENT_CELL_HEIGHT / 2, y2: y2 - TALENT_CELL_HEIGHT / 2 };
};

type Tier = {
  needs: number;
  row: number;
};

type TalentsLinksProps = {
  columns: number;
  rows: number;
  tiers: Tier[];
  tree: Tree;
};

const TalentsLinks = ({ columns, rows, tiers, tree }: TalentsLinksProps) => {
  const links = tree.talents.flatMap((talent) => {
    const from = tree.talents.find((candidate) => candidate.id === talent.requires);
    return from ? [{ from, to: talent }] : [];
  });

  return (
    <svg
      className="tree__links"
      height={gridHeight(rows)}
      viewBox={`0 0 ${gridWidth(columns)} ${gridHeight(rows)}`}
      width={gridWidth(columns)}
    >
      <defs>
        <marker
          id={`arrow-${tree.id}`}
          markerHeight="6"
          markerWidth="6"
          orient="auto"
          refX="5"
          refY="3"
        >
          <path d="M0,0 L6,3 L0,6 z" fill="currentColor" />
        </marker>
      </defs>
      {tiers.map(({ row }) => (
        <line
          className="tree__tier"
          key={row}
          x1={TIER_LABEL_WIDTH}
          x2={gridWidth(columns)}
          y1={tierY(row)}
          y2={tierY(row)}
        />
      ))}
      {links.map(({ from, to }) => (
        <line
          {...edgesFor(from, to)}
          data-testid={`link-${from.id}-${to.id}`}
          key={to.id}
          markerEnd={`url(#arrow-${tree.id})`}
          stroke="currentColor"
          strokeWidth="2"
        />
      ))}
      {tiers.map(({ needs, row }) => (
        <text
          className="tree__tier-label"
          dominantBaseline="middle"
          key={row}
          lengthAdjust="spacingAndGlyphs"
          textLength={TIER_LABEL_TEXT}
          x={0}
          y={tierY(row)}
        >
          нужно {needs}
        </text>
      ))}
    </svg>
  );
};

export default TalentsLinks;
