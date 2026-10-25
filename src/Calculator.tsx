import { Group } from "@mantine/core";
import type { TalentClass } from './types'
import TreeOfTalents from './TreeOfTalents';

type CalculatorProps = {
  talentClass: TalentClass
};

function Calculator({ talentClass }: CalculatorProps) {
  return (
    <section data-testid="calculator">
      <Group>
        {talentClass.trees.map((tree) => (
          <TreeOfTalents
            key={tree.id}
            tree={tree}
            talentClass={talentClass}
          />
        ))}
      </Group>
    </section>
  );
};

export default Calculator;
