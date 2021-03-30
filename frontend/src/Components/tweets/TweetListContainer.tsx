import { Checkbox, FormControlLabel } from "@material-ui/core";
import useAxios from "axios-hooks";
import moment from "moment";
import React, { useContext, useState } from "react";
import { AppContext } from "../../context/topicsContext";
import { Tweet } from "../../models";
import TweetList from "./TweetList";

/**
 * Dynamic list of tweets, based on context
 */
const TweetListContainer: React.FC = () => {
  const [{ data, error, loading }] = useAxios("http://localhost:5000/tweets");
  const { datasetFilter, topics } = useContext(AppContext);
  const [topicMatchOnly, setTopicMatchOnly] = useState<boolean>(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading tweets</div>;

  console.log(data.slice(0, 10));

  /**
   * Filter the dataset according to the filter options
   * supplied by the maintool via context
   */
  let filteredData: Tweet[] = [...data];
  if (datasetFilter) {
    if (datasetFilter.location) {
      filteredData = filteredData.filter((obj) => obj.location === datasetFilter.location);
    }
    filteredData = filteredData.filter((obj) => obj.time_raw >= datasetFilter.start && obj.time_raw < datasetFilter.end);
  }

  /**
   * Map topics to the tweets based on the content
   */
  filteredData = filteredData.map((tweet) => {
    // Get message of tweet to lower case
    const messagePrep = tweet.message.toLowerCase();

    // Check for all topics if some are relevant
    const matchedTopics = topics.filter((topic) => {
      // Topic is relevant is at least 1 of its terms is in the message
      return topic.terms.filter((term) => messagePrep.includes(term.toLowerCase())).length > 0;
    });

    return {
      ...tweet,
      topics: matchedTopics,
    };
  });

  /**
   * Optional: filter set on tweets that have at least one topic
   */
  if (topicMatchOnly) {
    filteredData = filteredData.filter((tweet) => tweet.topics.length > 0);
  }

  return (
    <div>
      <div style={{ padding: 6 }}>
        {datasetFilter && (
          <div>
            <p>Filters applied:</p>
            <table>
              <tr>
                <td>Start</td>
                <td>{moment(datasetFilter.start).format("HH:mm D MMM")}</td>
              </tr>
              <tr>
                <td>End</td>
                <td>{moment(datasetFilter.end).format("HH:mm D MMM")}</td>
              </tr>
              <tr>
                <td>Location</td>
                <td>{datasetFilter.location || "Any location"}</td>
              </tr>
            </table>
          </div>
        )}

        {/* Checkbox to toggle filtering tweets */}
        <FormControlLabel
          control={
            <Checkbox
              checked={topicMatchOnly}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTopicMatchOnly(event.target.checked)}
              color="primary"
              size="small"
            />
          }
          label={<div style={{ fontSize: 14 }}>Show only tweets that match with a topic</div>}
        />
      </div>

      <TweetList tweets={filteredData} />
    </div>
  );
};

export default TweetListContainer;
