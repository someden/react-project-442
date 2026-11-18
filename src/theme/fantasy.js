// Тема Mantine для фэнтези-оформления. Файл пришёл стартером, править его не
// нужно: передайте тему в MantineProvider в src/init.
//
//   import { theme } from "./theme/fantasy";
//   <MantineProvider theme={theme}>
import { createTheme } from "@mantine/core";

export const theme = createTheme({
  colors: {
    // Старое золото, от светлого блика до тёмной бронзы.
    gold: [
      "#fff3cf", "#f6e9c8", "#f3d98f", "#e9c46a", "#dcae4a",
      "#d19d32", "#c8901f", "#a8761a", "#8a5a12", "#5e3c0a",
    ],
    // Пергамент: светлые оттенки идут на фон, тёмные на текст.
    parchment: [
      "#fffaf0", "#f8efda", "#f6ebd3", "#f3e7cc", "#efe2c4",
      "#e6d3a3", "#d6b478", "#9a8f80", "#3b2c1a", "#241a0f",
    ],
  },
  primaryColor: "gold",
  primaryShade: { dark: 6, light: 6 },
  autoContrast: true,
  defaultRadius: "sm",
  headings: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: "700" },
});
