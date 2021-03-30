import { Tweet } from "../../models";
import truncate from "../../utils/truncate";
import { Tooltip } from "@material-ui/core";

interface Props {
  tweet: Tweet;
}

/**
 * Display a single tweet in a user-friendly way with all its attributes
 */
const TweetView: React.FC<Props> = ({ tweet }) => {
  // user-friendly date, create from Date (from epoch-time)
  const date = shortDateSting(new Date(tweet.time));

  const hasTopic = tweet.topics.length > 0;

  const color = tweet.topics.length > 0 ? tweet.topics[0].color : "#FFF";

  return (
    <Tooltip title={`Topic(s): ${tweet.topics.map((t) => t.title).join(", ")}`} disableHoverListener={!hasTopic} placement={"left"}>
      <div style={{ width: "100%", display: "flex" }}>
        <div style={{ width: 8, minWidth: 8, height: 80, marginRight: 10, borderRadius: 4, backgroundColor: color, flexBasis: 8 }}></div>
        <div>
          {/* Content of the tweet */}
          <div>{truncate(tweet.message, 140)}</div>

          {/* Metadata: time, author, location */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>{date}</div>
            <div>{truncate(tweet.account, 18)}</div>
            <div>{tweet.location}</div>
          </div>
        </div>
      </div>
    </Tooltip>
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
