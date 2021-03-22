import useAxios from "axios-hooks";
import React from "react";
import ReactWordcloud, { Callbacks, Optional, Options, Word } from "react-wordcloud";

interface Props {
  start: string;
  end: string;
}

/**
 * Show a wordcloud of words in a certain interval
 */
const WordCloud: React.FC<Props> = ({ start, end }) => {
  const [{ data, loading, error }] = useAxios({ url: "http://localhost:5000/word-frequency", params: { start_interval: start, end_interval: end } });

  if (loading) return <p>Loading</p>;
  if (error) return <p>Error</p>;

  const wordCloud = transFormResponse(data);

  const maxFreq = Math.max.apply(
    Math,
    wordCloud.map((w) => w.value)
  );

  const options: Optional<Options> = {
    padding: 1,
    rotations: 2,
    rotationAngles: [0, 90],
    scale: "log",
    spiral: "archimedean",

    fontFamily: "impact",
    fontSizes: [5, 65],
    fontStyle: "normal",
    fontWeight: "normal",
  };

  const callbacks: Optional<Callbacks> = {
    getWordColor: (word) => {
      return `rgba(0, 0, 255, ${word.value / maxFreq})`;
    },
  };

  return <ReactWordcloud words={wordCloud} options={options} size={[1200, 400]} callbacks={callbacks} />;
};

export default WordCloud;

/**
 * Convert API response to WordCloud input
 */
const transFormResponse = (data: Record<string, number>): Word[] => Object.keys(data).map((word) => ({ text: word, value: data[word] }));
