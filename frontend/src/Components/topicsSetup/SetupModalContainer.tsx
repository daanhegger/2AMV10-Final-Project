import { useSnackbar } from "notistack";
import React, { useContext } from "react";
import { AppContext } from "../../context/topicsContext";
import { Topic } from "../../models";
import SetupModal from "./SetupModal";

const SetupModalContainer: React.FC = () => {
  const { topicManagerOpened, setTopicManagerOpened, topics, setTopics } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const handleSave = (topics: Topic[]) => {
    setTopics(topics);
    window.localStorage.setItem("topics", JSON.stringify(topics));
    enqueueSnackbar("Successfully saved your topics", { variant: "success" });
  };

  return (
    <SetupModal onSave={handleSave} dialogOpened={topicManagerOpened} onCloseDialog={() => setTopicManagerOpened(false)} globalTopics={topics} />
  );
};

export default SetupModalContainer;
