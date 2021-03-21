import React, { createContext, useEffect, useState } from "react";
import { Topic } from "../models";

// Define the shape of the application global state
interface AppContextProps {
  topics: Topic[];
  setTopics(topics: Topic[]): void;

  topicManagerOpened: boolean;
  setTopicManagerOpened(state: boolean): void;
}

// Create an initial context
export const AppContext = createContext<AppContextProps>({} as AppContextProps);

/**
 * Implementation of the context
 * Default values and state storage
 */
export const AppProvider: React.FC = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicManagerOpened, setTopicManagerOpened] = useState<boolean>(false);

  // Restore topics from localstorage if present
  useEffect(() => {
    const lsTopics = localStorage.getItem("topics");
    if (lsTopics) {
      setTopics(JSON.parse(lsTopics));
    }
  }, []);

  const value: AppContextProps = { topics, setTopics, topicManagerOpened, setTopicManagerOpened };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};