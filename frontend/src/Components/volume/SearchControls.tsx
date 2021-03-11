import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

// Styling for material components
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
  })
);

interface Props {
  // Callback for adding new terms
  onAdd(terms: string[]): void;
}

/**
 * SearchBar to add new search terms
 */
const SearchControls: React.FC<Props> = ({ onAdd }) => {
  const classes = useStyles();
  const [text, setText] = useState<string>("");

  /**
   * Handle text to array converting, propagate data to parent
   * Reset field on success
   */
  const onSubmit: React.FormEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    // Validation, non-empty string required
    if (text.length > 0) {
      onAdd(text.split(",").map((term) => term.trim()));
      setText("");
    }
  };

  // TextField with search icon, press enter to submit (form)
  return (
    <Paper component="form" onSubmit={onSubmit} className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search for terms (comma seperated)"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchControls;
