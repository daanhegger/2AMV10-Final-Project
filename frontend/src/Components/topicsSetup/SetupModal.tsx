import React, { useState } from "react";
import {
  Dialog,
  Button,
  DialogActions,
  Grid,
  List,
  ListItem,
  DialogTitle,
  ListItemText,
  makeStyles,
  Theme,
  createStyles,
  InputBase,
} from "@material-ui/core";
import { Topic } from "../../models";
import truncate from "../../utils/truncate";
import { useSnackbar } from "notistack";
import EditTopic from "./EditTopic";

const defaultTopics: Topic[] = [
  { title: "Fire", color: "red", terms: ["fire", "smoke", "burn"] },
  { title: "Flood", color: "blue", terms: ["water", "leak", "water"] },
  { title: "Injury", color: "yellow", terms: ["hospital", "ambulance", "pain"] },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      minHeight: "90vh",
      maxHeight: "90vh",
    },
  })
);

/**
 * Setup wizard to allow user to manage the topics
 */
const SetupModal = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(true);
  const [topics, setTopics] = useState<Topic[]>(defaultTopics);

  // Active topic to edit, only save title since topic itself can change
  // Requirement: title should be unique
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const activeTopicObject = topics.find((t) => t.title === activeTopic);

  const handleClose = () => {
    setOpen(false);
  };

  /**
   * When a single topic is changed (by for example the EditTopic componenent)
   * we loop over all topics in memory and change the targetted one
   */
  const handleTopicChange = (changed: Topic) => {
    setTopics(
      topics.map((iterTopic) => {
        if (iterTopic.title === changed.title) {
          return changed;
        }
        return iterTopic;
      })
    );
  };

  /**
   * Handle adding a new topic to the list given a title
   */
  const handleAddTopic = (title: string) => {
    // No empty title
    if (title) {
      setTopics([...topics, { title, color: "#FF0000", terms: [] }]);
    }
  };

  /**
   * Handle deleteing a topic
   */
  const handleDeleteTopic = (topic: Topic) => {
    // Remove topic from list
    setTopics(topics.filter((t) => t.title !== topic.title));

    // Reset active topic, since a topic can only be removed when it is the active one
    setActiveTopic(null);
  };

  /**
   * When the user hits "Save", put all topics in localStorage as backup,
   * close the window and show a success notification
   */
  const handleSave = () => {
    window.localStorage.setItem("topics", JSON.stringify(topics));
    handleClose();
    enqueueSnackbar("Successfully saved your topics", { variant: "success" });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg" disableBackdropClick classes={{ paper: classes.dialog }}>
      {/* Top part: title */}
      <DialogTitle style={{ borderBottom: "1px solid #c7c7c7" }}>Set-up your topics for investigation</DialogTitle>

      {/* Middle part: main content of the dialog */}
      <Grid container direction="row" justify="flex-start" alignItems="stretch" style={{ flexGrow: 1, flexShrink: 1 }}>
        <Grid item md={3} style={{ borderRight: "1px solid #c7c7c7" }}>
          <div
            style={{
              height: "100%",
              maxHeight: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            {/* Menu to select a topic and make it active */}
            <div style={{ flexGrow: 1 }}>
              <List style={{ padding: 0, overflowY: "scroll", maxHeight: 600, flexGrow: 1 }}>
                {topics.map((topic) => {
                  const active = activeTopic !== null && activeTopic === topic.title;

                  return (
                    <ListItem
                      key={topic.title}
                      button
                      onClick={() => setActiveTopic(topic.title)}
                      disabled={active}
                      style={{ backgroundColor: active ? "#c7c7c7" : undefined }}
                    >
                      {/* Show clickable summarized info of every topic */}
                      <ListItemText primary={topic.title} secondary={topic.terms.length ? truncate(topic.terms.join(", "), 30) : "No terms yet..."} />
                    </ListItem>
                  );
                })}
              </List>
            </div>

            {/* Simple form to add a new topic */}
            <AddTopicInput onAdd={(title) => handleAddTopic(title)} />
          </div>
        </Grid>

        {/* Middle/right part of the dialog */}
        <Grid item md={9}>
          {/* Inspect & Edit active topic */}
          {activeTopicObject ? (
            // Show detail page of topic if a topic is selected
            <EditTopic topic={activeTopicObject} onChange={handleTopicChange} onDelete={() => handleDeleteTopic(activeTopicObject)} />
          ) : (
            // If not topic selected yet, helper text
            <p style={{ padding: 10 }}>No topic selected, choose one from the list on the left</p>
          )}
        </Grid>
      </Grid>

      {/* Bottom part: save the topics */}
      <DialogActions style={{ borderTop: "1px solid #c7c7c7" }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save &amp; close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetupModal;

interface AddTopicInputProps {
  onAdd(title: string): void;
}

/**
 * Simple textinput to add a new topic to the list
 * Wrapped in a form -> press enter to submit
 */
const AddTopicInput: React.FC<AddTopicInputProps> = ({ onAdd }) => {
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
