import { create } from "zustand";
import type { Build, TalentClass } from "./types";
import type { Change } from "./rules";
import { canApply, getTalentRank } from "./rules";

type BuildState = {
  build: Build;
  change: (c: Change) => void;
  refusal: string | null;
  replace: (build: Build) => void;
};

export const createBuildStore = (talentClass: TalentClass) =>
  create<BuildState>()((set) => ({
    build: {},
    refusal: null,
    change: ({ talentId, delta }) =>
      set((state) => {
        const verdict = canApply(state.build, talentClass, { talentId, delta });
        if (!verdict.ok) {
          return {
            build: state.build,
            refusal: verdict.reason,
          };
        }

        return {
          build: { ...state.build, [talentId]: getTalentRank(state.build, talentId) + delta },
          refusal: null,
        };
      }),
    replace: (build) => set({ build, refusal: null }),
  }));

export type UseBuild = ReturnType<typeof createBuildStore>;
