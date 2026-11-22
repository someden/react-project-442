import { useEffect, useState } from "react";
import { Button, Group, TextInput } from "@mantine/core";
import type { NotificationData, NotificationsStore } from "@mantine/notifications";
import { notifications } from "@mantine/notifications";
import type { UseBuild } from "./buildStore";
import { encodeBuild } from "./buildUtils";
import { useSavedBuilds } from "./savedBuildsStore";
import type { TalentsClass } from './types'
import TalentsTrees from './TalentsTrees';
import basePath from './basePath';

export type CalculatorProps = {
  talentsClass: TalentsClass;
  useBuild: UseBuild;
  notificationsStore: NotificationsStore;
};

const notificationId = 'refusal';

const Calculator = ({ talentsClass, useBuild, notificationsStore }: CalculatorProps) => {
  const build = useBuild((state) => state.build);
  const refusal = useBuild((state) => state.refusal);
  const change = useBuild((state) => state.change);
  const replace = useBuild((state) => state.replace);
  const save = useSavedBuilds((state) => state.save);
  const [buildName, setBuildName] = useState("");

  const link = `${window.location.origin}${basePath}/build/${encodeBuild(build)}`;

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
    notifications.hide(notificationId, notificationsStore);
    notifications.show(shown, notificationsStore);
  }, [refusal, notificationsStore]);

  useEffect(() => () => {
    notifications.hide(notificationId, notificationsStore);
  }, [notificationsStore]);


  return (
    <section data-testid="calculator">
      <Group align="flex-end" gap="sm" my="sm">
        <TextInput
          aria-label="Имя билда"
          data-testid="build-name"
          onChange={(event) => setBuildName(event.target.value)}
          placeholder="Имя билда"
          value={buildName}
        />
        <Button
          data-testid="save-build"
          disabled={buildName.trim() === ""}
          onClick={() => {
            save(buildName.trim(), build);
            setBuildName("");
          }}
        >
          Сохранить
        </Button>
        <Button data-testid="reset-build" onClick={() => replace({})} variant="default">
          Сбросить
        </Button>
      </Group>
      <p className="calculator__link">
        <a data-testid="share-link" href={link}>{link}</a>
      </p>
      <TalentsTrees
        talentsClass={talentsClass}
        build={build}
        change={change}
      />
    </section>
  );
};

export default Calculator;
