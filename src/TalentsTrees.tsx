import { Group, Text } from "@mantine/core";
import { getBuildTotal } from "./rules";
import type { Change } from "./rules";
import type { TalentsClass, Build } from './types'
import TalentsTree from './TalentsTree';

type TalentsTreesProps = {
  talentsClass: TalentsClass;
  build: Build;
  change?: (c: Change) => void;
  readonly?: boolean;
};

const TalentsTrees = ({ talentsClass, build, change = () => {}, readonly = false }: TalentsTreesProps) => (
  <>
    <Text className="budget" data-testid="budget-left" mb="sm">
      Осталось очков: {talentsClass.budget - getBuildTotal(build)}
    </Text>
    <Group align="flex-start">
      {talentsClass.trees.map((tree) => (
        <TalentsTree
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

export default TalentsTrees;
