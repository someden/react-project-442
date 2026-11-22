import { expect, test } from "vitest";

import { decodeBuild, encodeBuild } from "../src/buildUtils";
import type { TalentsClass } from "../src/types";

import hamsterJson from "./hamster.json";

const hamster: TalentsClass = hamsterJson;

test("билд переживает упаковку и разбор", () => {
  const build = { cheeks: 5, paws: 1 };

  expect(decodeBuild(encodeBuild(build), hamster)).toEqual({ ok: true, build });
});

test("код несёт номер версии формата", () => {
  expect(encodeBuild({ cheeks: 1 })).toMatch(/^v1\./);
});

test("чужая версия формата даёт отказ", () => {
  const foreign = encodeBuild({ cheeks: 1 }).replace("v1.", "v9.");

  expect(decodeBuild(foreign, hamster)).toMatchObject({ ok: false });
});

test("код без распределения очков даёт отказ", () => {
  expect(decodeBuild("v1.bnVsbA", hamster)).toMatchObject({ ok: false });
});

test("талант вне класса даёт отказ", () => {
  expect(decodeBuild(encodeBuild({ claws: 1 }), hamster)).toMatchObject({ ok: false });
});

test("билд сверх бюджета класса даёт отказ", () => {
  expect(decodeBuild(encodeBuild({ cheeks: 5, paws: 3 }), hamster)).toMatchObject({ ok: false });
});
