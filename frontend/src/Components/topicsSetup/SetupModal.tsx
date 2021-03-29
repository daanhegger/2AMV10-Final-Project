import React, { useEffect, useState } from "react";
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
  Snackbar,
} from "@material-ui/core";
import { Topic } from "../../models";
import truncate from "../../utils/truncate";
import EditTopic from "./EditTopic";
import AddTopic from "./AddTopic";
import { Alert } from "@material-ui/lab";
import { Alarm } from "@material-ui/icons";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      minHeight: "90vh",
      maxHeight: "90vh",
    },
  })
);

interface Props {
  onCloseDialog(): void;
  dialogOpened: boolean;
  onSave(topics: Topic[]): void;
  globalTopics: Topic[];
}

/**
 * Setup wizard to allow user to manage the topics
 */
const SetupModal: React.FC<Props> = ({ onCloseDialog, dialogOpened, globalTopics, onSave }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [topics, setTopics] = useState<Topic[]>(globalTopics);

  // Active topic to edit, only save title since topic itself can change
  // Requirement: title should be unique
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const activeTopicObject = topics.find((t) => t.title === activeTopic);

  const generalColor = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

  // When the topics change outside of this component, update them in here too
  useEffect(() => {
    setTopics(globalTopics);
  }, [globalTopics]);

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
    // No more then 10 topics
    if (topics.length > 9) {
      return;
    }

    // Title already exists, don't allow add
    if (topics.map((t) => t.title).includes(title)) {
      enqueueSnackbar("There already exists a topic with that name");
      return;
    }

    // No empty title
    if (title) {
      setTopics([...topics, { title, color: generalColor[topics.length], terms: [] }]);
    }
  };

  /**
   * Handle deleteing a topic
   */
  const handleDeleteTopic = (topic: Topic, topics: Topic[]) => {
    // The array of new topics
    let new_topics = topics.filter((t) => t.title !== topic.title);

    // Remove topic from list
    setTopics(new_topics);

    // Reset active topic, since a topic can only be removed when it is the active one
    setActiveTopic(null);

    // Recolor all the topics such that it is the same as the plotly colors
    new_topics.map((topic, index) => (topic.color = generalColor[index]));
  };

  /**
   * When the user hits "Save", handled by parent container
   */
  const handleSave = () => {
    onSave(topics);
    onCloseDialog();
  };

  const validToSave = () => {
    return topics.map(topic => {
      console.log(topic.terms.length)
      if (topic.terms.length === 0) {
        return true;
      } else {
        return false;
      }
    }).find(Boolean);
  };

  return (
    <Dialog open={dialogOpened} onClose={onCloseDialog} fullWidth maxWidth="lg" disableBackdropClick classes={{ paper: classes.dialog }}>
      {/* Top part: title */}
      <DialogTitle style={{ borderBottom: "1px solid #c7c7c7" }}>Topic manager: choose relevant terms for further investigation</DialogTitle>

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
            <AddTopic onAdd={handleAddTopic} topics={topics} />
            {topics.length >= 10 ? <Alert severity="warning">Maximum number of topics reached</Alert> : null}
          </div>
        </Grid>

        {/* Middle/right part of the dialog */}
        <Grid item md={9}>
          {/* Inspect & Edit active topic */}
          {activeTopicObject ? (
            // Show detail page of topic if a topic is selected
            <EditTopic
              topic={activeTopicObject}
              onChange={handleTopicChange}
              onDelete={() => handleDeleteTopic(activeTopicObject, topics)}
              topics={globalTopics}
            />
          ) : (
            // If not topic selected yet, helper text
            <p style={{ padding: 10 }}>No topic selected, choose one from the list on the left</p>
          )}
        </Grid>
      </Grid>

      {/* Bottom part: save the topics */}
      <DialogActions style={{ borderTop: "1px solid #c7c7c7" }}>
        <Button variant="text" onClick={() => onCloseDialog()}>
          Cancel
        </Button>

        { validToSave() ? <Alert severity="warning">One of the topics has no terms yet</Alert> : null}
        <Button variant="contained" disabled={validToSave()} color="primary" onClick={handleSave}>
          Save &amp; close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetupModal;
