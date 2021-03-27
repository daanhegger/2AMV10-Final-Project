import { Box, Button, Chip, Grid, Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";
import React from "react";
import { Topic } from "../../models";
import FindTerms from "./FindTerms";
import { ColorPicker } from "material-ui-color";

interface Props {
  topic: Topic;
  onChange(changed: Topic): void;
  onDelete(): void;
}

/**
 * Edit a single topic:
 * - Manage terms, color and delete topic all together
 */
const EditTopic: React.FC<Props> = ({ topic, onChange, onDelete }) => {
  const { enqueueSnackbar } = useSnackbar();

  // Request to delete a term from the topic
  const handleDeleteTerm = (term: string) => {
    onChange({
      ...topic,
      terms: topic.terms.filter((t) => t !== term),
    });
  };

  // Request to delete all terms from the topic
  const handleDeleteAllTerms = () => {
    onChange({
      ...topic,
      terms: [],
    });
  };

  // Request to add a new term to the topic
  // - Make sure that term is not already in topic, otherwise notify user
  const handleAddTerm = (term: string) => {
    if (!topic.terms.includes(term)) {
      // Term is new for topic
      onChange({
        ...topic,
        terms: [...topic.terms, term],
      });
    } else {
      // Term is already in topic, show notification
      enqueueSnackbar(
        <>
          <i style={{ marginRight: 6 }}>{term}</i> is already in the topic
        </>,
        { variant: "warning" }
      );
    }
  };

  // Update the topic color if the user requested it
  const handleChangeColor = (newColor?: string) => {
    if (newColor) {
      onChange({
        ...topic,
        color: newColor,
      });
    }
  };

  return (
    <Grid container alignItems="stretch" style={{ height: "100%" }}>
      <Grid item md={6}>
        {/* Left part of edit window, show current properties of topic */}

        <div style={{ borderRight: "1px solid #c7c7c7", height: "100%", padding: 10, display: "flex", flexDirection: "column" }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <h3>Topic: {topic.title}</h3>
            {topic.color}
            <ColorPicker value={topic.color} onChange={(color) => handleChangeColor(color.css.backgroundColor)} hideTextfield disableAlpha deferred />
          </Box>

          <div style={{ flex: 1 }}>
            {topic.terms.map((term, i) => (
              <Chip key={topic.title + term + i.toString()} label={term} onDelete={() => handleDeleteTerm(term)} style={{ margin: "0 8px 8px 0" }} />
            ))}
            {topic.terms.length === 0 && (
              <Typography color="textSecondary">
                No terms in this topic yet. Use the module on the right to search for and add new terms...
              </Typography>
            )}
          </div>

          {/* Button to delete topic */}
          <Box display="flex" justifyContent="space-between">
            <Button size="small" onClick={handleDeleteAllTerms}>
              Remove all terms
            </Button>
            <Button size="small" onClick={onDelete}>
              Delete topic
            </Button>
          </Box>
        </div>
      </Grid>
      <Grid item md={6}>
        {/* Right part of edit window, option to add terms */}
        <div style={{ padding: 10, height: "100%" }}>
          <FindTerms addTerm={handleAddTerm} alreadyAddedTerms={topic.terms} />
        </div>
      </Grid>
    </Grid>
  );
};

export default EditTopic;
