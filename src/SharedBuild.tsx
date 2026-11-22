import { Alert, Button } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";

import GroupOfTalents from "./GroupOfTalents";
import { decodeBuild } from "./buildUtils";
import type { UseBuild } from "./buildStore";
import type { TalentsClass } from "./types";

type SharedBuildProps = {
  talentsClass: TalentsClass;
  useBuild: UseBuild;
};

const SharedBuild = ({ talentsClass, useBuild }: SharedBuildProps) => {
  const { code = "" } = useParams();
  const navigate = useNavigate();
  const replace = useBuild((state) => state.replace);
  const decoded = decodeBuild(code, talentsClass);

  if (!decoded.ok) {
    return (
      <section data-testid="shared-build-error">
        <Alert color="red" mt="xs" variant="light">{decoded.reason}</Alert>
      </section>
    );
  }

  return (
    <section data-testid="shared-build">
      <p>Этот билд открыт только на чтение.</p>
      <Button
        data-testid="take-build"
        mb="sm"
        onClick={() => {
          replace(decoded.build);
          navigate("/");
        }}
      >
        Взять себе
      </Button>
      <GroupOfTalents
        talentsClass={talentsClass}
        build={decoded.build}
        readonly
      />
    </section>
  );
};

export default SharedBuild;
