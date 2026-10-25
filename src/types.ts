export type TalentClass = {
  name: string;
  budget: number;
  pointsPerRow: number;
  columns: number;
  trees: Tree[];
};

export type Tree = {
  id: string;
  name: string;
  talents: Talent[];
};

export type Talent = {
  id: string;
  name: string;
  row: number;
  col: number;
  maxRank: number;
  requires?: string;
  text: string;
};

export type TalentState = "available" | "locked" | "maxed";
