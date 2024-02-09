import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: {
      main: "#2196F3", // Material Blue
    },
    secondary: {
      main: "#FFC107", // Material Amber
    },
    error: {
      main: "#FF1744", // Material Red
    },
    warning: {
      main: "#FF9800", // Material Orange
    },
    info: {
      main: "#03A9F4", // Material Light Blue
    },
    success: {
      main: "#4CAF50", // Material Green
    },
    background: {
      default: "#757575", // Material Grey
      paper: "#ffffff", // Black
      teal: "#11D8E8",
      drakerTeal: "#0DA4B7",
    },
    text: {
      primary: "#FFFFFF", // white
    },
  },
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 768,
      laptop: 1024,
      desktop: 1200,
    },
  },
  // MuiInput: {
  //   styleOverrides: {
  //     root: {
  //       "&::before": {
  //         borderBottom: "2px solid var(--TextField-brandBorderColor)",
  //       },
  //       "&:hover:not(.Mui-disabled, .Mui-error):before": {
  //         borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
  //       },
  //       "&.Mui-focused:after": {
  //         borderBottom: "2px solid var(--TextField-brandBorderFocusedColor)",
  //       },
  //     },
  //   },
  // },
  // MuiFilledInput: {
  //   styleOverrides: {
  //     root: {
  //       "&::before, &::after": {
  //         borderBottom: "2px solid var(--TextField-brandBorderColor)",
  //       },
  //       "&:hover:not(.Mui-disabled, .Mui-error):before": {
  //         borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
  //       },
  //       "&.Mui-focused:after": {
  //         borderBottom: "2px solid var(--TextField-brandBorderFocusedColor)",
  //       },
  //     },
  //   },
  // },
});
export default theme;
