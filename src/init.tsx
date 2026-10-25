import { MantineProvider } from "@mantine/core";
import { Notifications, createNotificationsStore } from "@mantine/notifications";
import Calculator from './Calculator'
import type { TalentClass } from "./types";
import { createBuildStore } from "./store";

import "@mantine/core/styles.layer.css";
import "@mantine/notifications/styles.layer.css";
import "./init.css";

const init = (talentClass: TalentClass) => {
  const useBuild = createBuildStore(talentClass);
  const notificationsStore = createNotificationsStore();

  return (
    <MantineProvider>
      <Notifications position="bottom-right" store={notificationsStore} />
      <Calculator talentClass={talentClass} useBuild={useBuild} notificationsStore={notificationsStore} />
    </MantineProvider>
  );
};

export default init;
