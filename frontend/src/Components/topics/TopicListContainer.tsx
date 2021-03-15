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

      {/* If no topics created yet */}
      {topics.length === 0 && <p style={{ textAlign: "center" }}>No topics yet, use the topic manager to create</p>}

      {/* Button to open topic-manager */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Button onClick={() => setTopicManagerOpened(true)}>Open topic manager</Button>
      </Box>
    </div>
  );
};

export default TopicListContainer;
