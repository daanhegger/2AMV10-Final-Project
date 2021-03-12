import { AppBar, Container } from "@material-ui/core";
import React from "react";
import MainTool from "./Components/MainTool";

import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography style={{ flexGrow: 1 }} variant="h6">
            Tweet-Analyzer
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container>
        <div style={{ padding: "20px 0" }}>
          <MainTool />
        </div>
      </Container>
    </div>
  );
}

export default App;
