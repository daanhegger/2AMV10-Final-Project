import { InputBase } from "@material-ui/core";
import React, { useState } from "react";

interface Props {
  onAdd(title: string): void;
}

/**
 * Simple textinput to add a new topic to the list
 * Wrapped in a form -> press enter to submit
 */
const AddTopic: React.FC<Props> = ({ onAdd }) => {
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
      <InputBase fullWidth placeholder="Type a title and press enter..." value={text} onChange={(e) => setText(e.target.value)} />
    </form>
  );
};

export default AddTopic;
