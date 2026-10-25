export const TALENT_CELL_WIDTH = 160;
export const TALENT_CELL_HEIGHT = 160;
export const GAP = 16;
export const TIER_LABEL_WIDTH = 44;

export const TIER_LABEL_TEXT = TIER_LABEL_WIDTH - 6;

export const gridWidth = (columns: number) => columns * TALENT_CELL_WIDTH + (columns - 1) * GAP;

export const gridHeight = (rows: number) => rows * (TALENT_CELL_HEIGHT + GAP) - GAP;

export const centerX = (col: number) => col * (TALENT_CELL_WIDTH + GAP) + TALENT_CELL_WIDTH / 2;

export const centerY = (row: number) => row * (TALENT_CELL_HEIGHT + GAP) + TALENT_CELL_HEIGHT / 2;

export const tierY = (row: number) => row * (TALENT_CELL_HEIGHT + GAP) - GAP / 2;
