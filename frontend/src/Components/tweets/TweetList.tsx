import React from "react";
import { Divider, List, ListItem } from "@material-ui/core";
import { Tweet } from "../../models";
import TweetView from "./TweetView";

interface Props {
  tweets: Tweet[];
}

/**
 * Static list of tweets
 * Display-only, no network/logic
 */
const TweetList: React.FC<Props> = ({ tweets }) => {
  if (tweets.length === 0) {
    return <p style={{ padding: 10 }}>No tweets to show</p>;
  }

  return (
    <>
      <p style={{ padding: "0 8px" }}>Filtered down to {tweets.length} tweets:</p>
      <List>
        {tweets.slice(0, 200).map((tweet) => (
          <>
            <Divider />
            <ListItem key={JSON.stringify(tweet)}>
              <TweetView tweet={tweet} />
            </ListItem>
          </>
        ))}
      </List>
    </>
  );
};

export default TweetList;
