import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { Build } from "./types";

export type SavedBuild = { id: string; name: string; build: Build };

type SavedBuildsState = {
  saved: Record<string, SavedBuild>;
  save: (name: string, build: Build) => void;
  rename: (id: string, name: string) => void;
  duplicate: (id: string) => void;
  remove: (id: string) => void;
};

export const useSavedBuilds = create<SavedBuildsState>()(
  persist(
    immer((set) => ({
      saved: {},
      save: (name, build) =>
        set((state) => {
          const id = crypto.randomUUID();
          state.saved[id] = { build, id, name };
        }),
      rename: (id, name) =>
        set((state) => {
          if (state.saved[id]) state.saved[id].name = name;
        }),
      duplicate: (id) =>
        set((state) => {
          const source = state.saved[id];
          if (!source) return;
          const copy = crypto.randomUUID();
          state.saved[copy] = { build: { ...source.build }, id: copy, name: `${source.name} (копия)` };
        }),
      remove: (id) =>
        set((state) => {
          delete state.saved[id];
        }),
    })),
    { name: "talent-calculator-builds" },
  ),
);
