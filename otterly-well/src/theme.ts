import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#38bdf8", // sky-400
    },
    background: {
      default: "#111827", // gray-900
      paper: "#1f2937", // gray-800
    },
    text: {
      primary: "#f9fafb", // gray-50
      secondary: "#9ca3af", // gray-400
    },
  },
  typography: {
    fontFamily: "inherit",
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
});

export default theme;
