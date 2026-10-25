import type { CSSProperties } from "react";
import { Card, Stack, Text, Title, Tooltip } from "@mantine/core";

import type { TalentClass, Tree } from "./types";

const getRowsCount = (tree: Tree) =>
  tree.talents.reduce((last, talent) => Math.max(last, talent.row + 1), 0);

const TALENT_CELL_WIDTH = 140;
const TALENT_CELL_HEIGHT = 140;
const GAP = 16;

type TreeOfTalentsProps = {
  tree: Tree;
  talentClass: TalentClass;
};

function TreeOfTalents({ tree, talentClass }: TreeOfTalentsProps) {
  const rows = Array.from({ length: getRowsCount(tree) }, (_, i) => i);

  return (
    <Card data-testid={`tree-${tree.id}`} padding="sm" withBorder>
      <Title mb="xs" order={2}>
        {tree.name}
      </Title>
      <div
        className="talents-grid"
        style={
          {
            "--talent-width": `${TALENT_CELL_WIDTH}px`,
            "--talent-height": `${TALENT_CELL_HEIGHT}px`,
            "--columns": talentClass.columns,
            "--gap": `${GAP}px`,
          } as CSSProperties
        }

      >
        {rows.map((row) => {
          return (
            <div key={row} data-testid={`row-${tree.id}-${row}`} className="talents-grid__row">
              {Array.from({ length: talentClass.columns }, (_, col) => {
                const talent = tree.talents.find((it) => it.row === row && it.col === col);
                if (!talent) return <div className="talent" key={col} />;
                return (
                  <Tooltip
                    key={col}
                    multiline
                    position="top"
                    w={320}
                    withArrow
                    label={
                      <Stack gap={2}>
                        <Text>
                          {talent.name}
                        </Text>
                        <Text c="dimmed">
                          Ранг 0 из {talent.maxRank}
                        </Text>
                        <Text>{talent.text}</Text>
                      </Stack>
                    }
                  >
                    <button
                      data-testid={`talent-${talent.id}`}
                      data-state="locked"
                      type="button"
                      className="talent"
                    >
                      <span>{talent.name}</span>
                      <span className="talent-rank">
                        0/{talent.maxRank}
                      </span>
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default TreeOfTalents;
