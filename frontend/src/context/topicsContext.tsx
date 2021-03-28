import React, { createContext, useEffect, useState } from "react";
import { Topic } from "../models";

// Define the shape of the application global state
interface AppContextProps {
  topics: Topic[];
  setTopics(topics: Topic[]): void;

  topicManagerOpened: boolean;
  setTopicManagerOpened(state: boolean): void;

  frequencyType: string;
  setFrequencyType(frequency: string): void;

  frequencyAmount: number;
  setFrequencyAmount(amount: number): void;

}

// Create an initial context
export const AppContext = createContext<AppContextProps>({} as AppContextProps);

/**
 * Implementation of the context
 * Default values and state storage
 */
export const AppProvider: React.FC = ({ children }) => {
  const defaultValues = { amount: 1, unit: "H" };
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicManagerOpened, setTopicManagerOpened] = useState<boolean>(false);
  const [frequencyType, setFrequencyType] = useState<string>(defaultValues.unit);
  const [frequencyAmount, setFrequencyAmount] = useState<number>(defaultValues.amount);

  // Restore topics from localstorage if present
  useEffect(() => {
    const lsTopics = localStorage.getItem("topics");
    if (lsTopics) {
      setTopics(JSON.parse(lsTopics));
    }
  }, []);

  const value: AppContextProps = { topics, setTopics, topicManagerOpened, setTopicManagerOpened, frequencyType, setFrequencyType, frequencyAmount, setFrequencyAmount };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
