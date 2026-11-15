import type { CSSProperties } from "react";
import { Card, Stack, Text, Title, Tooltip } from "@mantine/core";

import {
  TALENT_CELL_HEIGHT,
  TALENT_CELL_WIDTH,
  GAP,
} from "./grid";
import type { Change } from "./rules";
import { getTreeTotal, getTalentRank, getTalentState, getRowNeeds } from "./rules";
import type { Build, TalentClass, Tree } from "./types";
import TalentLinks from "./TalentLinks";

const getRowsCount = (tree: Tree) =>
  tree.talents.reduce((last, talent) => Math.max(last, talent.row + 1), 0);

type TreeOfTalentsProps = {
  tree: Tree;
  talentClass: TalentClass;
  build: Build;
  change: (c: Change) => void;
};

function TreeOfTalents({ tree, talentClass, build, change }: TreeOfTalentsProps) {
  const rows = Array.from({ length: getRowsCount(tree) }, (_, i) => i);
  const treeTotal = getTreeTotal(build, talentClass, tree.id);

  return (
    <Card
      className="tree"
      data-testid={`tree-${tree.id}`}
      padding="sm"
      withBorder
    >
      <Title className="tree__title" mb="xs" order={2}>
        {tree.icon && <img alt="" className="tree__icon" src={tree.icon} />}
        {tree.name}
      </Title>
      <div
        className="tree__grid"
        style={
          {
            "--cell-w": `${TALENT_CELL_WIDTH}px`,
            "--cell-h": `${TALENT_CELL_HEIGHT}px`,
            "--columns": talentClass.columns,
            "--gap": `${GAP}px`,
          } as CSSProperties
        }

      >
        <TalentLinks
          tree={tree}
          rows={rows.length}
          columns={talentClass.columns}
          tiers={rows.slice(1).map((row) => ({ needs: getRowNeeds(talentClass, row), row }))}
        />
        {rows.map((row) => {
          return (
            <div key={row} data-testid={`row-${tree.id}-${row}`} className="tree__row">
              {Array.from({ length: talentClass.columns }, (_, col) => {
                const talent = tree.talents.find((it) => it.row === row && it.col === col);
                if (!talent) return <div className="cell cell__empty" key={col} />;
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
                          Ранг {getTalentRank(build, talent.id)} из {talent.maxRank}
                        </Text>
                        <Text>{talent.text}</Text>
                      </Stack>
                    }
                  >
                    <button
                      data-testid={`talent-${talent.id}`}
                      data-state={getTalentState(build, talentClass, talent)}
                      type="button"
                      className="cell"
                      onClick={() => change({ talentId: talent.id, delta: 1 })}
                      onContextMenu={(event) => {
                        event.preventDefault();
                        change({ talentId: talent.id, delta: -1 });
                      }}
                    >
                      {talent.icon ? (
                        <img alt="" className="cell__icon" src={talent.icon} />
                      ) : (
                        <span aria-hidden className="cell__icon cell__icon_letter">
                          {talent.name.slice(0, 1)}
                        </span>
                      )}
                      <span className="cell__name">{talent.name}</span>
                      <span className="cell__rank">
                        {getTalentRank(build, talent.id)}/{talent.maxRank}
                      </span>
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          );
        })}
      </div>
      <Text className="tree__spent" data-testid={`tree-spent-${tree.id}`} mt="xs">
        Вложено: {treeTotal}
      </Text>
    </Card>
  );
};

export default TreeOfTalents;
