import { Alert, List, MantineProvider } from "@mantine/core";
import { createNotificationsStore } from "@mantine/notifications";
import App from './App'
import type { TalentsClass } from "./types";
import { createBuildStore } from "./buildStore";
import { validateTalentsClass } from "./validateTalentsClass";

import "@mantine/core/styles.layer.css";
import "@mantine/notifications/styles.layer.css";
import "./theme/fantasy.css";
import { theme } from "./theme/fantasy";

const errorsScreen = (talentsClass: TalentsClass, errors: string[]) => {
  return (
    <main className="calculator">
      <h1>{talentsClass.name}</h1>
      <Alert color="red" title="Класс не отрисован, в данных ошибки.">
        <List data-testid="structure-errors">
          {errors.map((error) => <List.Item key={error}>{error}</List.Item>)}
        </List>
      </Alert>
    </main>
  );
};

const calculatorScreen = (talentsClass: TalentsClass) => {
  const useBuild = createBuildStore(talentsClass);
  const notificationsStore = createNotificationsStore();

  return (
    <App talentsClass={talentsClass} useBuild={useBuild} notificationsStore={notificationsStore} />
  );
};


const init = (talentsClass: TalentsClass) => {
  const errors = validateTalentsClass(talentsClass);

  return (
    <MantineProvider theme={theme}>
      {errors.length > 0 ? errorsScreen(talentsClass, errors) : calculatorScreen(talentsClass)}
    </MantineProvider>
  );
};

export default init;
