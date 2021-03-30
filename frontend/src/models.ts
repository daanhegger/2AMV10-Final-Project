export interface Tweet {
  time: Date;
  location: string;
  account: string;
  message: string;
  topics: Topic[];
  time_raw: string;
}

export interface Topic {
  title: string;
  color: string;
  terms: string[];
}

export interface TermSuggestion {
  term: string;
  score: number;
  vector: { x: number; y: number };
}

export interface Coord {
  x: Date;
  y: number;
}

export interface Interval {
  start: string;
  end: string;
}

export interface DatasetFilter {
  start: string;
  end: string;
  location?: string;
}
