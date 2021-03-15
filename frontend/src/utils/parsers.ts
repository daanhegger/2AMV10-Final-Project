import { TermSuggestion } from "../models";

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
