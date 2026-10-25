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

type TalentId = string;
type Rank = number;

export type Talent = {
  id: TalentId;
  name: string;
  row: number;
  col: number;
  maxRank: Rank;
  requires?: string;
  text: string;
};

export type TalentState = "available" | "locked" | "maxed";

export type Build = Record<TalentId, Rank>;
