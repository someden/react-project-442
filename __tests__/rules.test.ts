import { expect, test } from "vitest";

import { canApply } from "../src/rules";
import type { TalentsClass } from "../src/types";

import hamsterJson from "./hamster.json";

const hamster: TalentsClass = hamsterJson;

const invest = (talentId: string) => ({ talentId, delta: 1 });
const withdraw = (talentId: string) => ({ talentId, delta: -1 });

test("максимальный ранг таланта не превышается", () => {
  expect(canApply({ cheeks: 4 }, hamster, invest("cheeks"))).toMatchObject({ ok: true });
  expect(canApply({ cheeks: 5 }, hamster, invest("cheeks"))).toMatchObject({ ok: false });
});

test("бюджет класса не превышается", () => {
  expect(canApply({ cheeks: 5, paws: 1 }, hamster, invest("paws"))).toMatchObject({ ok: true });
  expect(canApply({ cheeks: 5, paws: 2 }, hamster, invest("fur"))).toMatchObject({ ok: false });
});

test("ряд закрыт, пока в дереве не набрано нужное число очков", () => {
  expect(canApply({}, hamster, invest("fur"))).toMatchObject({ ok: false });
  expect(canApply({ cheeks: 3 }, hamster, invest("fur"))).toMatchObject({ ok: false });
  expect(canApply({ cheeks: 4 }, hamster, invest("fur"))).toMatchObject({ ok: true });
});

test("талант требует опору, выкачанную до максимума", () => {
  expect(canApply({ cheeks: 4 }, hamster, invest("paws"))).toMatchObject({ ok: false });
  expect(canApply({ cheeks: 5 }, hamster, invest("paws"))).toMatchObject({ ok: true });
});

test("снятие идёт, пока опоры хватает, и отказывает, когда перестаёт", () => {
  expect(canApply({ cheeks: 5, fur: 1 }, hamster, withdraw("cheeks"))).toMatchObject({ ok: true });
  expect(canApply({ cheeks: 4, fur: 1 }, hamster, withdraw("cheeks"))).toMatchObject({ ok: false });
});

test("отказ несёт причину словами", () => {
  const verdict = canApply({ cheeks: 4, fur: 1 }, hamster, withdraw("cheeks"));
  expect(verdict.ok).toBe(false);
  expect(verdict.ok === false && verdict.reason).toContain("Мех");
});
