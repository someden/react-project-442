import { MantineProvider } from "@mantine/core";
import Calculator from './Calculator'
import type { TalentClass } from "./types";

import "@mantine/core/styles.layer.css";
import "./init.css";

const init = (talentClass: TalentClass) => (
  <MantineProvider>
    <Calculator talentClass={talentClass} />
  </MantineProvider>
);

export default init;
