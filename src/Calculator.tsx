import { Group, Text } from "@mantine/core";
import { getBuildTotal } from "./rules";
import type { UseBuild } from "./store";
import type { TalentClass } from './types'
import TreeOfTalents from './TreeOfTalents';

type CalculatorProps = {
  talentClass: TalentClass;
  useBuild: UseBuild;
};

function Calculator({ talentClass, useBuild }: CalculatorProps) {
  const build = useBuild((state) => state.build);
  const change = useBuild((state) => state.change);

  return (
    <section data-testid="calculator">
      <Text data-testid="budget-left" mb="sm">
        Осталось очков: {talentClass.budget - getBuildTotal(build)}
      </Text>
      <Group>
        {talentClass.trees.map((tree) => (
          <TreeOfTalents
            key={tree.id}
            tree={tree}
            talentClass={talentClass}
            build={build}
            change={change}
          />
        ))}
      </Group>
    </section>
  );
};

export default Calculator;
