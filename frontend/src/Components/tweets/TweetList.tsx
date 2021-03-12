import React from "react";
import { ListItem } from "@material-ui/core";
import { Tweet } from "../../models";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import TweetView from "./TweetView";

/**
 * Helper component for ReactWindow
 */
const Row = React.memo(({ index, style, data: tweets }: ListChildComponentProps) => (
  <ListItem style={style}>
    <TweetView tweet={tweets[index]} />
  </ListItem>
));

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
      <p>Showing {tweets.length} tweets:</p>
      <List height={750} itemCount={tweets.length} itemSize={100} width={"100%"} itemData={tweets}>
        {Row}
      </List>
    </>
  );
};

export default TweetList;
