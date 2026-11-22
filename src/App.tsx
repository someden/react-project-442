import { Anchor, Group } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Calculator from "./Calculator";
import type { CalculatorProps } from "./Calculator";
import SavedBuilds from "./SavedBuilds";
import SharedBuild from "./SharedBuild";

const App = ({ talentsClass, notificationsStore, useBuild }: CalculatorProps) => (
  <BrowserRouter>
    <Notifications position="bottom-right" store={notificationsStore} />
    <main className="calculator">
      <header className="calculator__header">
        <p className="calculator__kicker">Калькулятор талантов</p>
        <h1>{talentsClass.name}</h1>
        <Group gap="md" mb="sm">
          <Anchor component={Link} data-testid="nav-calculator" to="/">Калькулятор</Anchor>
          <Anchor component={Link} data-testid="nav-saved" to="/saved">Сохранённые</Anchor>
        </Group>
      </header>
      <Routes>
        <Route
          element={<Calculator talentsClass={talentsClass} notificationsStore={notificationsStore} useBuild={useBuild} />}
          path="/"
        />
        <Route element={<SavedBuilds useBuild={useBuild} />} path="/saved" />
        <Route element={<SharedBuild talentsClass={talentsClass} useBuild={useBuild} />} path="/build/:code" />
        <Route element={<p>Такого экрана нет.</p>} path="*" />
      </Routes>
    </main>
  </BrowserRouter>
);

export default App;
