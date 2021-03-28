import { InputBase } from "@material-ui/core";
import React, { useState } from "react";
import { Topic } from "../../models";

interface Props {
  onAdd(title: string): void;
  topics: Topic[];
}

/**
 * Simple textinput to add a new topic to the list
 * Wrapped in a form -> press enter to submit
 */
const AddTopic: React.FC<Props> = ({ onAdd, topics}) => {
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setText("");
        onAdd(text);
      }}
      style={{ padding: "10px 16px" }}
    >
      <InputBase disabled={topics.length >= 10? true : false} fullWidth placeholder="Type a title and press enter..." value={text} onChange={(e) => setText(e.target.value)} />
    </form>
  );
};

export default AddTopic;
