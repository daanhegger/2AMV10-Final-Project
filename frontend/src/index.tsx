import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { SnackbarProvider } from "notistack";

import CssBaseline from "@material-ui/core/CssBaseline";
// Import material font
import "fontsource-roboto";
import { AppProvider } from "./context/topicsContext";

// https://react-wordcloud.netlify.app/readme
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

ReactDOM.render(
  <React.StrictMode>
    {/* CssBaseline: Change default css properties to make page more material-like */}
    <CssBaseline />

    {/* Providor for material ui date/time pickers */}
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      {/* Provider for imperative API for material ui snackbar (notifications) */}
      <SnackbarProvider maxSnack={3}>
        <AppProvider>
          <App />
        </AppProvider>
      </SnackbarProvider>
    </MuiPickersUtilsProvider>
  </React.StrictMode>,

  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
