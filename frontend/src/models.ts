export interface Tweet {
  time: Date;
  location: string;
  account: string;
  message: string;
}

export interface Topic {
  title: string;
  color: string;
  terms: string[];
}
