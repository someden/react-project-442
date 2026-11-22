import { Button, Card, Group, List, TextInput } from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { useSavedBuilds } from "./savedBuildsStore";
import type { UseBuild } from "./buildStore";

const SavedBuilds = ({ useBuild }: { useBuild: UseBuild }) => {
  const saved = useSavedBuilds((state) => state.saved);
  const rename = useSavedBuilds((state) => state.rename);
  const duplicate = useSavedBuilds((state) => state.duplicate);
  const remove = useSavedBuilds((state) => state.remove);
  const replace = useBuild((state) => state.replace);
  const navigate = useNavigate();

  const entries = Object.values(saved);

  return (
    <section data-testid="saved-builds">
      <h2>Сохранённые билды</h2>
      {entries.length === 0 ? <p>Здесь пока пусто.</p> : (
        <List listStyleType="none">
          {entries.map((entry) => (
            <Card
              component="li"
              data-testid={`saved-build-${entry.name}`}
              key={entry.id}
              mb="xs"
              padding="sm"
              withBorder
            >
              <Group gap="sm">
                <TextInput
                  aria-label={`Имя билда ${entry.name}`}
                  data-testid={`rename-build-${entry.name}`}
                  onChange={(event) => rename(entry.id, event.target.value)}
                  value={entry.name}
                />
                <Button
                  data-testid={`open-build-${entry.name}`}
                  onClick={() => {
                    replace(entry.build);
                    navigate("/");
                  }}
                >
                  Открыть
                </Button>
                <Button
                  data-testid={`duplicate-build-${entry.name}`}
                  onClick={() => duplicate(entry.id)}
                  variant="default"
                >
                  Дублировать
                </Button>
                <Button
                  color="red"
                  data-testid={`delete-build-${entry.name}`}
                  onClick={() => remove(entry.id)}
                  variant="light"
                >
                  Удалить
                </Button>
              </Group>
            </Card>
          ))}
        </List>
      )}
    </section>
  );
};

export default SavedBuilds;
