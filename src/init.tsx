import { MantineProvider } from "@mantine/core";
import Calculator from './Calculator'
import type { TalentClass } from "./types";
import { createBuildStore } from "./store";

import "@mantine/core/styles.layer.css";
import "./init.css";

const init = (talentClass: TalentClass) => {
  const useBuild = createBuildStore(talentClass);
  
  return (
    <MantineProvider>
      <Calculator talentClass={talentClass} useBuild={useBuild} />
    </MantineProvider>
  );
};

export default init;
