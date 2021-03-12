import React, { useState } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TopicsList from "./topics/TopicsList";

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
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="primary"
      >
        <Tab label="Topics" />
        <Tab label="Tweets" />
      </Tabs>

      {/* Defining the views, conditional rendering based on the currently active tab */}
      {/* 0: Topic view */}
      {value === 0 && (
        <TopicsList
          topics={new Array(10).fill(undefined).map((_, i) => ({
            title: `Topic ${i}`,
            color: "red",
            terms: new Array(10).fill(undefined).map((_, i) => `term ${i}`),
          }))}
        />
      )}

      {/* 1: Tweet inpection view */}
      {value === 1 && <p>Tweet view, todo</p>}
    </>
  );
};

export default Sidebar;
