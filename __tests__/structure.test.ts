import { expect, test } from "vitest";

import { validateTalentsClass } from "../src/validateTalentsClass";
import type { TalentsClass } from "../src/types";

import blockedTierJump from "../__fixtures__/broken/blocked-tier-jump.json";
import cycle from "../__fixtures__/broken/cycle.json";
import diagonalRequires from "../__fixtures__/broken/diagonal-requires.json";
import fifthColumn from "../__fixtures__/broken/fifth-column.json";
import foreignRequires from "../__fixtures__/broken/foreign-requires.json";
import missingRequires from "../__fixtures__/broken/missing-requires.json";
import twoChildren from "../__fixtures__/broken/two-children.json";

import demo from "../__fixtures__/classes/demo.json";
import scout from "../__fixtures__/classes/scout.json";
import emptyTree from "../__fixtures__/edge/empty-tree.json";
import limits from "../__fixtures__/edge/limits.json";
import rowGap from "../__fixtures__/edge/row-gap.json";
import singleTalent from "../__fixtures__/edge/single-talent.json";
import sparseRow from "../__fixtures__/edge/sparse-row.json";
import unreachable from "../__fixtures__/edge/unreachable.json";

const validFixtures = [
  demo,
  scout,
  emptyTree,
  limits,
  rowGap,
  singleTalent,
  sparseRow,
  unreachable,
];

test.each(validFixtures)('валидная фикстура "$name" поломок не даёт', (talentsClass) => {
  expect(validateTalentsClass(talentsClass)).toEqual([]);
});

test("замкнутая цепочка опор находится", () => {
  expect(validateTalentsClass(cycle as TalentsClass).join(" ")).toContain("замкнулась");
});

test("опора из другого дерева находится", () => {
  expect(validateTalentsClass(foreignRequires as TalentsClass).join(" ")).toContain("другого дерева");
});

test("опора, которой нет в классе, находится", () => {
  expect(validateTalentsClass(missingRequires as TalentsClass).join(" ")).toContain("ghost");
});

test("косая связь находится", () => {
  expect(validateTalentsClass(diagonalRequires as TalentsClass).join(" "))
    .toContain("связь идёт в соседнюю колонку");
});

test("связь через ряд законна", () => {
  const overTier: TalentsClass = {
    name: "Через ряд",
    budget: 5,
    pointsPerRow: 5,
    columns: 1,
    trees: [
      {
        id: "line",
        name: "Линия",
        talents: [
          { id: "top", name: "Верх", row: 0, col: 0, maxRank: 1, text: "Верх." },
          { id: "bottom", name: "Низ", row: 2, col: 0, maxRank: 1, requires: "top", text: "Низ." },
        ],
      },
    ],
  };

  expect(validateTalentsClass(overTier)).toEqual([]);
});

test("занятая клетка на пути связи через ряд находится", () => {
  expect(validateTalentsClass(blockedTierJump as TalentsClass).join(" ")).toContain("на пути стоит");
});

test("связь снизу вверх находится", () => {
  const upward: TalentsClass = {
    name: "Вверх ногами",
    budget: 5,
    pointsPerRow: 5,
    columns: 1,
    trees: [
      {
        id: "line",
        name: "Линия",
        talents: [
          {
            id: "top",
            name: "Верх",
            row: 0,
            col: 0,
            maxRank: 1,
            requires: "bottom",
            text: "Верх.",
          },
          { id: "bottom", name: "Низ", row: 1, col: 0, maxRank: 1, text: "Низ." },
        ],
      },
    ],
  };

  expect(validateTalentsClass(upward).join(" ")).toContain("вниз по своей колонке");
});

test("выход за потолок колонок находится", () => {
  expect(validateTalentsClass(fifthColumn as TalentsClass).join(" ")).toContain("колонок 5");
});

test("вторая связь от одного таланта находится", () => {
  expect(validateTalentsClass(twoChildren as TalentsClass).join(" ")).toContain("сразу два");
});
