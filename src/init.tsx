import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import App from './App.tsx'

const init = () => (
  <MantineProvider>
    <App />
  </MantineProvider>
);

export default init;
