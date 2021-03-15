import { Box, Button } from "@material-ui/core";
import React, { useContext } from "react";
import { AppContext } from "../../context/topicsContext";
import TopicsList from "./TopicsList";

const TopicListContainer: React.FC = () => {
  const { setTopicManagerOpened, topics } = useContext(AppContext);

  return (
    <div>
      {/* Topic list itself */}
      <TopicsList topics={topics} />

      {/* Button to open topic-manager */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Button onClick={() => setTopicManagerOpened(true)}>Open manager</Button>
      </Box>
    </div>
  );
};

export default TopicListContainer;
