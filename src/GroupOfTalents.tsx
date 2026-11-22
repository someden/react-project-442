import { Group, Text } from "@mantine/core";
import { getBuildTotal } from "./rules";
import type { Change } from "./rules";
import type { TalentClass, Build } from './types'
import TreeOfTalents from './TreeOfTalents';

type GroupOfTalentsProps = {
  talentClass: TalentClass;
  build: Build;
  change?: (c: Change) => void;
  readonly?: boolean;
};

const GroupOfTalents = ({ talentClass, build, change = () => {}, readonly = false }: GroupOfTalentsProps) => (
  <>
    <Text className="budget" data-testid="budget-left" mb="sm">
      Осталось очков: {talentClass.budget - getBuildTotal(build)}
    </Text>
    <Group align="flex-start">
      {talentClass.trees.map((tree) => (
        <TreeOfTalents
          key={tree.id}
          tree={tree}
          talentClass={talentClass}
          build={build}
          change={change}
          readonly={readonly}
        />
      ))}
    </Group>
  </>
);

export default GroupOfTalents;
