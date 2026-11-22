import { Alert, List, MantineProvider } from "@mantine/core";
import { createNotificationsStore } from "@mantine/notifications";
import App from './App'
import type { TalentClass } from "./types";
import { createBuildStore } from "./buildStore";
import { validateTalentClass } from "./validateTalentClass";

import "@mantine/core/styles.layer.css";
import "@mantine/notifications/styles.layer.css";
import "./theme/fantasy.css";
import { theme } from "./theme/fantasy";

const errorsScreen = (talentClass: TalentClass, errors: string[]) => {
  return (
    <main className="calculator">
      <h1>{talentClass.name}</h1>
      <Alert color="red" title="Класс не отрисован, в данных ошибки.">
        <List data-testid="structure-errors">
          {errors.map((error) => <List.Item key={error}>{error}</List.Item>)}
        </List>
      </Alert>
    </main>
  );
};

const calculatorScreen = (talentClass: TalentClass) => {
  const useBuild = createBuildStore(talentClass);
  const notificationsStore = createNotificationsStore();

  return (
    <App talentClass={talentClass} useBuild={useBuild} notificationsStore={notificationsStore} />
  );
};


const init = (talentClass: TalentClass) => {
  const errors = validateTalentClass(talentClass);

  return (
    <MantineProvider theme={theme}>
      {errors.length > 0 ? errorsScreen(talentClass, errors) : calculatorScreen(talentClass)}
    </MantineProvider>
  );
};

export default init;
