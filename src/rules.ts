import type { Build, Talent, TalentClass, TalentState } from "./types";

export const getTalentRank = (build: Build, talentId: string): number => build[talentId] ?? 0;

export type Change = { talentId: string; delta: number };

type Verdict = { ok: boolean };

export const canApply = (build: Build, talentClass: TalentClass, change: Change): Verdict => {
  const talent = getTalentById(talentClass, change.talentId);
  if (!talent) {
    return { ok: false };
  }

  const nextRank = getTalentRank(build, change.talentId) + change.delta;
  if (
    nextRank > talent.maxRank ||
    nextRank < 0 ||
    (change.delta > 0 && change.delta + getBuildTotal(build) > talentClass.budget)
  ) {
    return { ok: false };
  }

  const nextBuild = { ...build, [change.talentId]: nextRank };

  if (validateBuild(talentClass, nextBuild).length > 0) {
    return { ok: false };
  }

  return { ok: true };
};

const getTalentById = (talentClass: TalentClass, talentId: string): Talent | undefined =>
  getTalents(talentClass).find((talent) => talent.id === talentId);

type TalentWithTreeId = Talent & { treeId: string };

const getTalents = (talentClass: TalentClass): TalentWithTreeId[] =>
  talentClass.trees.flatMap((tree) => tree.talents.map((talent) => ({ ...talent, treeId: tree.id })));;

export const getBuildTotal = (build: Build): number =>
  Object.values(build).reduce((sum, rank) => sum + rank, 0);

export const getTreeTotal = (build: Build, talentClass: TalentClass, treeId: string): number => {
  const tree = talentClass.trees.find((tree) => tree.id === treeId);
  if (!tree) {
    return 0;
  }

  return tree.talents.reduce((sum, talent) => sum + getTalentRank(build, talent.id), 0);
};

type InvalidTalent = { talentId: string; };

export const validateBuild = (talentClass: TalentClass, build: Build) => {
  const talents = getTalents(talentClass);
  const invalidTalents: InvalidTalent[] = [];

  for (const talent of talents) {
    if (getTalentRank(build, talent.id) === 0) continue;
    const rowNeeds = getRowNeeds(talentClass, talent.row);
    const treeTotal = getTreeTotal(build, talentClass, talent.treeId);
    if (treeTotal < rowNeeds) {
      invalidTalents.push({ talentId: talent.id })
    }
    if (talent.requires) {
      const required = getTalentById(talentClass, talent.requires);
      if (required && getTalentRank(build, required.id) < required.maxRank) {
        invalidTalents.push({ talentId: talent.id })
      }
    }
  }

  return invalidTalents;
};

const getRowNeeds = (talentClass: TalentClass, row: number): number => talentClass.pointsPerRow * row;

export const getTalentState = (build: Build, talentClass: TalentClass, talent: Talent): TalentState => {
  if (getTalentRank(build, talent.id) >= talent.maxRank) {
    return "maxed";
  }

  const nextBuild = { ...build, [talent.id]: getTalentRank(build, talent.id) + 1 };
  const locked = validateBuild(talentClass, nextBuild).some((invalidTalent) => invalidTalent.talentId === talent.id);

  return locked ? "locked" : "available";
};
