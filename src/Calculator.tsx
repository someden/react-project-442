import { useEffect } from "react";
import type { NotificationData, NotificationsStore } from "@mantine/notifications";
import { notifications } from "@mantine/notifications";
import type { UseBuild } from "./buildStore";
import type { TalentClass } from './types'
import GroupOfTalents from './GroupOfTalents';

export type CalculatorProps = {
  talentClass: TalentClass;
  useBuild: UseBuild;
  notificationsStore: NotificationsStore;
};

const notificationId = 'refusal';

const Calculator = ({ talentClass, useBuild, notificationsStore }: CalculatorProps) => {
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
      <GroupOfTalents
        talentClass={talentClass}
        build={build}
        change={change}
      />
    </section>
  );
};

export default Calculator;
