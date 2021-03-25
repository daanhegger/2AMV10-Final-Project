import { Coord, TermSuggestion } from "../models";

/**
 * Converts the HTTP resonse of /similar-words to local structure
 */
export const similarTermParser = (obj: any): TermSuggestion => ({
  term: obj.word,
  score: parseFloat(obj.score),
  vector: {
    x: parseFloat(obj.vector[0]),
    y: parseFloat(obj.vector[1]),
  },
});

/**
 * Map Flask /volume object response to coordinate-array for chartjs
 */
export const dataMapperToChartjs = (data: Record<string, number>): Coord[] =>
  Object.keys(data).map<Coord>((key, i) => ({
    x: new Date(parseInt(key)),
    y: data[key],
    fillColor: "#FF0000",
  }));
