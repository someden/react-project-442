import { getTalents, getTalentById } from "./rules";
import type { TalentWithTreeId } from "./rules";
import type { Talent, TalentsClass } from "./types";

const LIMITS = { columns: 4, rows: 7, trees: 6 };

const TIER_REACH = 2;

const straight = (from: Talent, to: Talent) => {
  const rows = to.row - from.row;
  const cols = Math.abs(to.col - from.col);
  return rows === 0 ? cols === 1 : cols === 0 && rows >= 1 && rows <= TIER_REACH;
};

const blockerBetween = (talentsClass: TalentsClass, from: TalentWithTreeId, to: TalentWithTreeId) =>
  getTalents(talentsClass).find((other) =>
    other.treeId === to.treeId && other.col === to.col && other.row === from.row + 1
  );

const rowCount = (talentsClass: TalentsClass) =>
  getTalents(talentsClass).reduce((last, talent) => Math.max(last, talent.row + 1), 0);

export const validateTalentsClass = (talentsClass: TalentsClass): string[] => {
  const errors: string[] = [];

  if (talentsClass.trees.length > LIMITS.trees) {
    errors.push(`деревьев ${talentsClass.trees.length}, формат держит не больше ${LIMITS.trees}`);
  }
  if (talentsClass.columns > LIMITS.columns) {
    errors.push(`колонок ${talentsClass.columns}, формат держит не больше ${LIMITS.columns}`);
  }
  if (rowCount(talentsClass) > LIMITS.rows) {
    errors.push(`рядов ${rowCount(talentsClass)}, формат держит не больше ${LIMITS.rows}`);
  }

  const unlocks = new Map<string, string>();
  for (const talent of getTalents(talentsClass)) {
    if (talent.col >= talentsClass.columns) {
      errors.push(`«${talent.name}» стоит в колонке ${talent.col + 1}, в классе их ${talentsClass.columns}`);
    }
    if (!talent.requires) continue;

    const required = getTalentById(talentsClass, talent.requires);
    if (!required) {
      errors.push(`«${talent.name}» требует талант ${talent.requires}, которого в классе нет`);
      continue;
    }
    if (required.treeId !== talent.treeId) {
      errors.push(`«${talent.name}» требует «${required.name}» из другого дерева`);
    } else if (straight(required, talent)) {
      const between = talent.row - required.row === TIER_REACH
        ? blockerBetween(talentsClass, required, talent)
        : undefined;
      if (between) {
        errors.push(
          `«${required.name}» открывает «${talent.name}» через ряд, `
          + `и на пути стоит «${between.name}», `
          + "связь через ряд проходит только по пустой клетке",
        );
      }
    } else {
      errors.push(
        `«${talent.name}» из ряда ${talent.row + 1} колонки ${talent.col + 1} требует `
        + `«${required.name}» из ряда ${required.row + 1} колонки ${required.col + 1}, `
        + "связь идёт в соседнюю колонку того же ряда "
        + "или вниз по своей колонке на ряд или через ряд",
      );
    }
    const taken = unlocks.get(required.id);
    if (taken) {
      const other = getTalentById(talentsClass, taken);
      errors.push(
        `«${required.name}» открывает сразу два таланта, «${other?.name}» и «${talent.name}», `
        + "а связь бывает только одна",
      );
    }
    unlocks.set(required.id, talent.id);
  }

  for (const talent of getTalents(talentsClass)) {
    const seen = new Set([talent.id]);
    let current = talent.requires ? getTalentById(talentsClass, talent.requires) : undefined;
    while (current) {
      if (seen.has(current.id)) {
        errors.push(`цепочка опор замкнулась на «${current.name}»`);
        break;
      }
      seen.add(current.id);
      current = current.requires ? getTalentById(talentsClass, current.requires) : undefined;
    }
  }

  return [...new Set(errors)];
};
