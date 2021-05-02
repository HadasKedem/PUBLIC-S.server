import { createMuiTheme } from "@material-ui/core";
import { jssPreset } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import React from "react";

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const theme = createMuiTheme({
  direction: "rtl",
});

export const RTL = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <StylesProvider jss={jss}>{children}</StylesProvider>
    </ThemeProvider>
  );
};
