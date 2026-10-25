import { create } from "zustand";
import type { Build, TalentClass } from "./types";
import type { Change } from "./rules";
import { canApply, getTalentRank } from "./rules";

type BuildState = {
  build: Build;
  change: (c: Change) => void;
};

export const createBuildStore = (talentClass: TalentClass) =>
  create<BuildState>()((set) => ({
    build: {},
    change: ({ talentId, delta }) =>
      set((state) => {
        const verdict = canApply(state.build, talentClass, { talentId, delta });
        if (!verdict.ok) {
          return state;
        }

        return {
          build: { ...state.build, [talentId]: getTalentRank(state.build, talentId) + delta },
        };
      }),
  }));

export type UseBuild = ReturnType<typeof createBuildStore>;
