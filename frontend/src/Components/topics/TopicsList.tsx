import React, {useEffect, useMemo, useState} from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { createStyles, FormControlLabel, makeStyles, Theme } from "@material-ui/core";
import truncate from "../../utils/truncate";

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

/**
 * Summarized list of topics
 */
const TopicsList = () => {
  const classes = useStyles();

  const [localStorageTopics, getLocalStorageList] = useState(JSON.parse(localStorage.getItem('topicsList')||'[]'))

  const topics = useMemo(() => {
    return localStorageTopics.map((topic: string) => ({
      title: `${topic}`,
      color: "red",
      terms: localStorageTopics.map((topic: string) => `${topic}`),
    }));
    },[localStorageTopics])

  useEffect(() => {
    async function init() {
      window.addEventListener('storage', () => {
        getLocalStorageList(JSON.parse(localStorage.getItem('topicsList')||'[]'));
      })};
    init();}, [])

  return (
    <>
      {topics.map((topic: { title: string; terms: string[]; }) => (
        <Accordion key={topic.title} square elevation={0} className={classes.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} classes={{ content: classes.accordionSummary }}>
            <FormControlLabel
              onClick={(event) => event.stopPropagation()}
              onFocus={(event) => event.stopPropagation()}
              control={<Checkbox size="small" />}
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
