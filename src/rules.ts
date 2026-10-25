import type { Build, Talent, TalentClass, TalentState } from "./types";

export const getTalentRank = (build: Build, talentId: string): number => build[talentId] ?? 0;

export type Change = { talentId: string; delta: number };

type Verdict = { ok: true } | { ok: false, reason: string };

export const canApply = (build: Build, talentClass: TalentClass, change: Change): Verdict => {
  const talent = getTalentById(talentClass, change.talentId);
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

  if (change.delta > 0 && change.delta + getBuildTotal(build) > talentClass.budget) {
    return { ok: false, reason: `Бюджет класса ${talentClass.budget} и все очки разложены` };
  }

  const nextBuild = { ...build, [change.talentId]: nextRank };
  const invalidTalents = validateBuild(talentClass, nextBuild);

  if (invalidTalents.length > 0) {
    return { ok: false, reason: invalidTalents[0].message };
  }

  return { ok: true };
};

export type TalentWithTreeId = Talent & { treeId: string };

export const getTalentById = (talentClass: TalentClass, talentId: string): TalentWithTreeId | undefined =>
  getTalents(talentClass).find((talent) => talent.id === talentId);

export const getTalents = (talentClass: TalentClass): TalentWithTreeId[] =>
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

type InvalidTalent = { talentId: string; message: string; };

export const validateBuild = (talentClass: TalentClass, build: Build) => {
  const talents = getTalents(talentClass);
  const invalidTalents: InvalidTalent[] = [];

  for (const talent of talents) {
    if (getTalentRank(build, talent.id) === 0) continue;
    const rowNeeds = getRowNeeds(talentClass, talent.row);
    const treeTotal = getTreeTotal(build, talentClass, talent.treeId);
    if (treeTotal < rowNeeds) {
      invalidTalents.push({
        talentId: talent.id,
        message: `Для таланта «${talent.name}» нужно ${rowNeeds} очков опоры, а набрано ${treeTotal}`,
      })
    }
    if (talent.requires) {
      const required = getTalentById(talentClass, talent.requires);
      if (required && getTalentRank(build, required.id) < required.maxRank) {
        invalidTalents.push({
          talentId: talent.id,
          message: `Для таланта «${talent.name}» нужно ${required.maxRank} очков опоры, а набрано ${getTalentRank(build, required.id)}`,
        })
      }
    }
  }

  return invalidTalents;
};

export const getRowNeeds = (talentClass: TalentClass, row: number): number => talentClass.pointsPerRow * row;

export const getTalentState = (build: Build, talentClass: TalentClass, talent: Talent): TalentState => {
  if (getTalentRank(build, talent.id) >= talent.maxRank) {
    return "maxed";
  }

  const nextBuild = { ...build, [talent.id]: getTalentRank(build, talent.id) + 1 };
  const locked = validateBuild(talentClass, nextBuild).some((invalidTalent) => invalidTalent.talentId === talent.id);

  return locked ? "locked" : "available";
};
