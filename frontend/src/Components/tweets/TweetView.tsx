import { Tweet } from "../../models";
import truncate from "../../utils/truncate";
import { Tooltip } from "@material-ui/core";
import moment from "moment";

interface Props {
  tweet: Tweet;
}

/**
 * Display a single tweet in a user-friendly way with all its attributes
 */
const TweetView: React.FC<Props> = ({ tweet }) => {
  // user-friendly date, create from Date (from epoch-time)
  const date = moment(tweet.time_raw).format("HH:mm D MMM");

  const hasTopic = tweet.topics.length > 0;

  const colors = tweet.topics.length > 0 ? tweet.topics.map((t) => t.color) : ["#FFF"];

  return (
    <Tooltip title={`Topic(s): ${tweet.topics.map((t) => t.title).join(", ")}`} disableHoverListener={!hasTopic} placement={"left"}>
      <div style={{ minHeight: 80, width: "100%", display: "flex", alignItems: "stretch" }}>
        {/* Color indicator */}
        {colors.map((c) => (
          <div key={c} style={{ width: 8, minWidth: 8, marginRight: 4, borderRadius: 4, backgroundColor: c, flexBasis: 8 }}></div>
        ))}

        {/* Tweet display */}
        <div style={{ display: "flex", flexGrow: 1, flexDirection: "column", justifyContent: "space-between" }}>
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
