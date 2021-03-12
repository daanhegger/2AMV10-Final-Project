import useAxios from "axios-hooks";
import React from "react";
import TweetList from "./TweetList";

/**
 * Dynamic list of tweets, based on context
 */
const TweetListContainer: React.FC = () => {
  const [{ data, error, loading }] = useAxios("http://localhost:5000/tweets");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading tweets</div>;

  return <TweetList tweets={data} />;
};

export default TweetListContainer;
