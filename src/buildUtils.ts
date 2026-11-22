import { getTalentById, getBuildTotal, validateBuild } from "./rules";
import type { Build, TalentsClass } from "./types";

export const CODE_VERSION = 1;

const toBase64Url = (text: string) => {
  const base64 = btoa(text);
  const base64url = base64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  return base64url;
};

const fromBase64Url = (base64url: string) => {
  const base64 = base64url.replaceAll("-", "+").replaceAll("_", "/");
  const text = atob(base64);
  return text;
};

export const encodeBuild = (build: Build): string =>
  `v${CODE_VERSION}.${toBase64Url(JSON.stringify(build))}`;

export type DecodeResult = { ok: true; build: Build } | { ok: false; reason: string };

export const decodeBuild = (code: string, talentsClass: TalentsClass): DecodeResult => {
  const dot = code.indexOf(".");
  const version = dot === -1 ? "" : code.slice(0, dot);
  if (!/^v\d+$/.test(version)) {
    return { ok: false, reason: "Ссылка не несёт номера версии формата" };
  }
  if (version !== `v${CODE_VERSION}`) {
    return {
      ok: false,
      reason: `Ссылка сделана форматом ${version}, приложение читает v${CODE_VERSION}`,
    };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(fromBase64Url(code.slice(dot + 1)));
  } catch {
    return { ok: false, reason: "Код билда не разбирается" };
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, reason: "Код билда не несёт распределения очков" };
  }

  for (const [talentId, rank] of Object.entries(parsed)) {
    const talent = getTalentById(talentsClass, talentId);
    if (!talent) {
      return { ok: false, reason: `В билде стоит талант ${talentId}, которого в классе нет` };
    }
    if (!Number.isInteger(rank) || (rank as number) < 1 || (rank as number) > talent.maxRank) {
      return {
        ok: false,
        reason: `У «${talent.name}» в билде ранг ${rank} при максимуме ${talent.maxRank}`,
      };
    }
  }

  const build = parsed as Build;
  if (getBuildTotal(build) > talentsClass.budget) {
    return {
      ok: false,
      reason: `В билде ${getBuildTotal(build)} очков при бюджете класса ${talentsClass.budget}`,
    };
  }
  const broken = validateBuild(talentsClass, build);
  if (broken.length > 0) return { ok: false, reason: broken[0].message };

  return { ok: true, build };
};
