import type { Tree, Build, Talent, TalentsClass, TalentState } from "./types";

export const getTalentRank = (build: Build, talentId: string): number => build[talentId] ?? 0;

export type Change = { talentId: string; delta: number };

type Verdict = { ok: true } | { ok: false, reason: string };

export const canApply = (build: Build, talentsClass: TalentsClass, change: Change): Verdict => {
  const talent = getTalentById(talentsClass, change.talentId);
  if (!talent) {
    return { ok: false, reason: `В классе нет таланта ${change.talentId}` };
  }

  const nextRank = getTalentRank(build, change.talentId) + change.delta;
  if (nextRank > talent.maxRank) {
    return { ok: false, reason: `Талант "${talent.name}" уже на максимальном ранге ${talent.maxRank}` };
  }

  if (nextRank < 0) {
    return { ok: false, reason: `В «${talent.name}» нечего снимать` };
  }

  if (change.delta > 0 && change.delta + getBuildTotal(build) > talentsClass.budget) {
    return { ok: false, reason: `Бюджет класса ${talentsClass.budget} и все очки разложены` };
  }

  const nextBuild = { ...build, [change.talentId]: nextRank };
  const invalidTalents = validateBuild(talentsClass, nextBuild);

  if (invalidTalents.length > 0) {
    return { ok: false, reason: invalidTalents[0].message };
  }

  return { ok: true };
};

export type TalentWithTreeId = Talent & { treeId: string };

export const getTalentById = (talentsClass: TalentsClass, talentId: string): TalentWithTreeId | undefined =>
  getTalents(talentsClass).find((talent) => talent.id === talentId);

export const getTalents = (talentsClass: TalentsClass): TalentWithTreeId[] =>
  talentsClass.trees.flatMap((tree) => tree.talents.map((talent) => ({ ...talent, treeId: tree.id })));;

export const getBuildTotal = (build: Build): number =>
  Object.values(build).reduce((sum, rank) => sum + rank, 0);

const getTreeById = (talentsClass: TalentsClass, treeId: string): Tree | undefined =>
  talentsClass.trees.find((tree) => tree.id === treeId);

export const getTreeTotal = (build: Build, talentsClass: TalentsClass, treeId: string): number => {
  const tree = getTreeById(talentsClass, treeId);
  if (!tree) {
    return 0;
  }

  return tree.talents.reduce((sum, talent) => sum + getTalentRank(build, talent.id), 0);
};

type InvalidTalent = { talentId: string; message: string; };

export const validateBuild = (talentsClass: TalentsClass, build: Build) => {
  const talents = getTalents(talentsClass);
  const invalidTalents: InvalidTalent[] = [];

  for (const talent of talents) {
    if (getTalentRank(build, talent.id) === 0) continue;
    const tree = getTreeById(talentsClass, talent.treeId);
    const rowNeeds = getRowNeeds(talentsClass, talent.row);
    const treeTotal = getTreeTotal(build, talentsClass, talent.treeId);
    if (treeTotal < rowNeeds) {
      invalidTalents.push({
        talentId: talent.id,
        message:
          `«${talent.name}» стоит в ряду ${talent.row + 1} дерева «${tree?.name}», `
          + `а ряду нужно ${rowNeeds} очков при набранных ${treeTotal}`,
      })
    }
    if (talent.requires) {
      const required = getTalentById(talentsClass, talent.requires);
      if (required && getTalentRank(build, required.id) < required.maxRank) {
        invalidTalents.push({
          talentId: talent.id,
          message:
            `Опора «${talent.name}» это «${required.name}» ${required.maxRank}/${required.maxRank}, `
            + `а там ${getTalentRank(build, required.id)}/${required.maxRank}`,
        })
      }
    }
  }

  return invalidTalents;
};

export const getRowNeeds = (talentsClass: TalentsClass, row: number): number => talentsClass.pointsPerRow * row;

export const getTalentState = (build: Build, talentsClass: TalentsClass, talent: Talent): TalentState => {
  if (getTalentRank(build, talent.id) >= talent.maxRank) {
    return "maxed";
  }

  const nextBuild = { ...build, [talent.id]: getTalentRank(build, talent.id) + 1 };
  const locked = validateBuild(talentsClass, nextBuild).some((invalidTalent) => invalidTalent.talentId === talent.id);

  return locked ? "locked" : "available";
};
