import { Group, Text } from "@mantine/core";
import { getBuildTotal } from "./rules";
import type { Change } from "./rules";
import type { TalentsClass, Build } from './types'
import TreeOfTalents from './TreeOfTalents';

type GroupOfTalentsProps = {
  talentsClass: TalentsClass;
  build: Build;
  change?: (c: Change) => void;
  readonly?: boolean;
};

const GroupOfTalents = ({ talentsClass, build, change = () => {}, readonly = false }: GroupOfTalentsProps) => (
  <>
    <Text className="budget" data-testid="budget-left" mb="sm">
      Осталось очков: {talentsClass.budget - getBuildTotal(build)}
    </Text>
    <Group align="flex-start">
      {talentsClass.trees.map((tree) => (
        <TreeOfTalents
          key={tree.id}
          tree={tree}
          talentsClass={talentsClass}
          build={build}
          change={change}
          readonly={readonly}
        />
      ))}
    </Group>
  </>
);

export default GroupOfTalents;
