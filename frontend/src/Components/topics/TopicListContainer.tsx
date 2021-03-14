import { Box, Button } from "@material-ui/core";
import React, { useContext } from "react";
import { AppContext } from "../../context/topicsContext";
import TopicsList from "./TopicsList";

const TopicListContainer: React.FC = () => {
  const { setTopicManagerOpened, topics } = useContext(AppContext);

  return (
    <div>
      <TopicsList topics={topics} />
      <Box display="flex" justifyContent="center" mt={2}>
        <Button onClick={() => setTopicManagerOpened(true)}>Open manager</Button>
      </Box>
    </div>
  );
};

export default TopicListContainer;
