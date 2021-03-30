import React, { useState } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TweetListContainer from "./tweets/TweetListContainer";
import TopicListContainer from "./topics/TopicListContainer";
import { Paper } from "@material-ui/core";

/**
 * Content the sidebar (drawer)
 * - Tabs to select view
 */
const Sidebar: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      {/* Bar with the tab buttons */}
      <Paper square>
        <Tabs value={value} onChange={handleChange} variant="fullWidth" indicatorColor="primary">
          <Tab label="Topics" />
          <Tab label="Tweets" />
        </Tabs>
      </Paper>

      {/* Defining the views, conditional rendering based on the currently active tab */}
      {/* 0: Topic view */}
      {value === 0 && <TopicListContainer />}

      {/* 1: Tweet inpection view */}
      {value === 1 && <TweetListContainer />}
    </>
  );
};

export default Sidebar;
