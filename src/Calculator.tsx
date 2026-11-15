import { useEffect } from "react";
import { Group, Text } from "@mantine/core";
import type { NotificationData, NotificationsStore } from "@mantine/notifications";
import { notifications } from "@mantine/notifications";
import { getBuildTotal } from "./rules";
import type { UseBuild } from "./store";
import type { TalentClass } from './types'
import TreeOfTalents from './TreeOfTalents';

type CalculatorProps = {
  talentClass: TalentClass;
  useBuild: UseBuild;
  notificationsStore: NotificationsStore
};

const notificationId = 'refusal';

function Calculator({ talentClass, useBuild, notificationsStore }: CalculatorProps) {
  const build = useBuild((state) => state.build);
  const refusal = useBuild((state) => state.refusal);
  const change = useBuild((state) => state.change);

  useEffect(() => {
    if (refusal === null) {
      notifications.hide(notificationId, notificationsStore);
      return;
    }

    const shown: NotificationData = {
      id: notificationId,
      "data-testid": notificationId,
      autoClose: false,
      color: "red",
      message: refusal,
    };
    notifications.show(shown, notificationsStore);
  }, [refusal, notificationsStore]);

  useEffect(() => () => {
    notifications.hide(notificationId, notificationsStore);
  }, [notificationsStore]);


  return (
    <section data-testid="calculator">
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
          />
        ))}
      </Group>
    </section>
  );
};

export default Calculator;
