import { Tweet } from "../../models";
import truncate from "../../utils/truncate";

interface Props {
  tweet: Tweet;
}

/**
 * Display a single tweet in a user-friendly way with all its attributes
 */
const TweetView: React.FC<Props> = ({ tweet }) => {
  // user-friendly date, create from Date (from epoch-time)
  const date = shortDateSting(new Date(tweet.time));

  return (
    <div style={{ padding: 8 }}>
      {/* Content of the tweet */}
      <div>{truncate(tweet.message, 140)}</div>

      {/* Metadata: time, author, location */}
      <div>
        {date} {tweet.account} {tweet.location}
      </div>
    </div>
  );
};

export default TweetView;

/**
 * Convert the date into a short user friendly string
 */
const shortDateSting = (date: Date): string => {
  const hour = new Intl.DateTimeFormat("nl", { hour: "2-digit" }).format(date);

  // Minutes don't have leading zeroes :(
  let minutes: string | number = date.getMinutes();
  if (minutes < 9) minutes = "0" + minutes;

  const day = new Intl.DateTimeFormat("en", { day: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(date);

  return `${hour}:${minutes} ${day} ${month}`;
};
