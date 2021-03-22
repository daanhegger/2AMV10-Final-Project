import React, { useState } from "react";
import {AppBar, Box, Container, createStyles, Drawer, makeStyles, Tab, Tabs, Theme} from "@material-ui/core";
import MainTool from "./Components/MainTool";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import Sidebar from "./Components/Sidebar";

const drawerWidth = 400;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    },
  })
);

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const classes = useStyles();
  const [sidebar, setSidebar] = useState<boolean>(true);
  const [value, setValue] = useState(0);


  return (
    <div className={classes.root}>
      {/* Top bar with title of tool and button to expand/collapse sidebar */}
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography style={{ flexGrow: 1 }} variant="h6">
            Y*int Analyzer
          </Typography>
          <Tabs value={value} onChange={(_, newValue) => (setValue(newValue))} aria-label="simple tabs example">
            <Tab label="Home" {...a11yProps(0)} />
            <Tab label="Explore" {...a11yProps(1)} />
          </Tabs>
          <IconButton edge="end" color="inherit" onClick={() => setSidebar(!sidebar)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <TabPanel value={value} index={0}/>
      <TabPanel value={value} index={1}/>

      {/* Center part of the tool */}
      <main
        // Conditional classes to adapt to "opened" state of the sidebar
        className={clsx(classes.content, {
          [classes.contentShift]: sidebar,
        })}
      >
        <Container>
          {/* Empty toolbar to compensate the height of the appbar */}
          <Toolbar />

          <div style={{ padding: "30px 0" }}>
            {/* Main content of the page: the visualizations */}
            <MainTool window={value} />
          </div>
        </Container>
      </main>

      {/* Collapsable sidebar */}
      <Drawer
        open={sidebar}
        variant="persistent"
        anchor="right"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {/* Empty toolbar to compensate the height of the appbar */}
        <Toolbar />

        {/* Content of the sidebar */}
        <Sidebar />
      </Drawer>
    </div>
  );
}

export default App;
