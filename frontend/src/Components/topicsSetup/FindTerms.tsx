import React, { useEffect, useState } from "react";
import { CircularProgress, List, ListItem, ListItemSecondaryAction, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { TermSuggestion } from "../../models";
import axios from "axios";
import { useSnackbar } from "notistack";
import { similarTermParser } from "../../utils/parsers";
import { Scatter } from "react-chartjs-2";
import { numberToColorHsl } from "../../utils/colors";
import useAxios from "axios-hooks";

interface Props {
  addTerm(term: string): void;
  alreadyAddedTerms: string[];
}

/**
 * User can type a term, and similar terms will be provided,
 * finally, the user can choose terms that are interesting
 */
const FindTerms: React.FC<Props> = ({ addTerm, alreadyAddedTerms }) => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<TermSuggestion[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  // Request all words in the dataset
  const [word2vecAxios] = useAxios("http://localhost:5000/word2vec");
  const allWords: string[] = word2vecAxios.loading || word2vecAxios.error ? [] : word2vecAxios.data.map((row: any) => row[2]);

  useEffect(() => {
    if (query) {
      setLoading(true);
      axios
        .get("http://localhost:5000/similar-words", { params: { query } })
        .then((response) => {
          // Convert HTTP data response to custom format
          const list = response.data.map(similarTermParser);
          setSuggestions(list);
        })
        .catch((e) => {
          // Error!
          enqueueSnackbar("Error while loading similar words", { variant: "error" });
          setSuggestions([]);
          console.error("Error loading /similar-words", e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [enqueueSnackbar, query]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Select initial seed for word similarity */}
      <Autocomplete<string, false, true, true>
        options={allWords}
        value={query}
        loading={loading || word2vecAxios.loading}
        freeSolo
        onChange={(e, newValue) => setQuery(newValue || "")}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Start typing to find terms"
            // Show loading spinner during API request
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        disabled={loading}
      />

      {/* Suggestion list, ordered by score */}
      <div style={{ overflow: "scroll", flexGrow: 1, maxHeight: 400 }}>
        <List>
          {suggestions.map((termSuggestion, i) => {
            const alreadyChosen = alreadyAddedTerms.includes(termSuggestion.term);
            return (
              <ListItem key={i} button onClick={() => addTerm(termSuggestion.term)} disabled={alreadyChosen}>
                <div>
                  {/* Show the term and score in the list */}
                  {/* Strike-through if already selected */}
                  {/* Title */}
                  <span style={{ textDecoration: alreadyChosen ? "line-through" : undefined }}>{termSuggestion.term}</span>

                  {/* Score of the term */}
                  <ListItemSecondaryAction>
                    <span style={{ textDecoration: alreadyChosen ? "line-through" : undefined }}>{termSuggestion.score}</span>
                  </ListItemSecondaryAction>
                </div>

                {/* Score indicator: horizontal line where width = score * 100% and the color is from red to green  */}
                <div
                  style={{
                    width: `${Math.round(termSuggestion.score * 100).toString()}%`,
                    height: 2,
                    background: numberToColorHsl(termSuggestion.score * 100),
                    bottom: 0,
                    left: 0,
                    position: "absolute",
                  }}
                ></div>
              </ListItem>
            );
          })}
        </List>
      </div>

      {/* Scatter plot for term vectors */}
      <ScatterPlotTerms points={suggestions} />
    </div>
  );
};

export default FindTerms;

interface ScatterPlotTermsProps {
  points: TermSuggestion[];
}

/**
 * Display vectorized terms in a scatter plot
 */
const ScatterPlotTerms: React.FC<ScatterPlotTermsProps> = ({ points }) => {
  const dataset: Chart.ChartDataSets = {
    label: "Terms in 2D space",
    data: points.map((p) => ({ x: p.vector.x, y: p.vector.y })),
  };

  return <Scatter data={{ datasets: [dataset] }}></Scatter>;
};
