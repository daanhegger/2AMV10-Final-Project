import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {Badge, Chip, createStyles, FormControlLabel, makeStyles, Theme} from "@material-ui/core";
import truncate from "../../utils/truncate";
import { Topic } from "../../models";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accordion: {
      border: "none",
      borderBottom: "1px solid rgba(0, 0, 0, .125)",
      boxShadow: "none",
    },
    accordionSummary: {
      alignItems: "center",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  })
);

interface Props {
  topics: Topic[];
}

/**
 * Summarized list of topics
 */
const TopicsList: React.FC<Props> = ({ topics }) => {
  const classes = useStyles();

  return (
    <>
      {topics.map((topic: { title: string; color: string; terms: string[] }) => (
        <Accordion key={topic.title} square elevation={0} className={classes.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} classes={{ content: classes.accordionSummary }}>
            <FormControlLabel
              onClick={(event) => event.stopPropagation()}
              onFocus={(event) => event.stopPropagation()}
              control={<Chip style={{backgroundColor: topic.color, opacity: 0.8, width: 25, marginRight: 15, marginLeft: 5}}/>}
              label={topic.title}
            />

            <Typography color="textSecondary">{truncate(topic.terms.join(", "), 20)}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="textSecondary">{topic.terms.join(", ")}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default TopicsList;
