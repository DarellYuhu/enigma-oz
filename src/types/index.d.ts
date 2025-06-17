type OpaData = {
  data: Record<string, number[]>;
  date: number[];
  datestr: string[];
};

type OpaRes = {
  dic: {
    key: string; // <-- a number
    name: string;
    pcol: string; // <-- a color
    pct: number;
  }[];
  data: { "1d": OpaData; "1m": OpaData; "1w": OpaData };
};

type OpaNormalizedData = {
  [key: string]: number | string;
};

type OpaGeoRes = {
  pct_last: {
    "1d": PctData[];
    "1w": PctData[];
    "1m": PctData[];
  };
  pct_total: PctData[];
  region: string;
  rid: string;
}[];

type PctData = {
  key: string; // <-- a number
  name: string;
  value: number;
  rank: number;
};
