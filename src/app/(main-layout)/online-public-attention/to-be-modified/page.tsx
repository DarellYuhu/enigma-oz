import { TimeSeries } from "./components/time-series";
import { format, subYears } from "date-fns";
import axios from "axios";
import generateNodeColors from "@/utils/generateNodeColors";

type Params = {
  searchParams: {
    period?: string;
    selected?: string;
  };
};

export default async function TestingPage({ searchParams }: Params) {
  const { selected } = searchParams;
  const terms = (
    await axios.post<TermsRes>("http://172.233.75.107:8912/api/queries")
  ).data;
  const timeseries = (
    await axios.post<OpaRes>("http://172.233.75.107:8912/api/terms", {
      type: "get-trends-terms",
      terms: selected ?? "1 2 3",
      level: "1",
      since: format(subYears(new Date(), 1), "yyyy-MM-dd"),
      until: format(new Date(), "yyyy-MM-dd"),
      details: "PH",
    })
  ).data;
  const colors = generateNodeColors(
    terms.terms.map((t) => t.key),
    "random"
  );
  const normalized = normalizeTimeseries(timeseries);

  return (
    <div>
      <TimeSeries
        options={terms.terms.map((t) => ({ label: t.name, value: t.key }))}
        dic={timeseries.dic}
        colors={colors}
        data={normalized}
      />
    </div>
  );
}

const normalizeTimeseries = (data: OpaRes) => {
  const keys = data.dic.map((item) => item.key);

  return {
    week: data.data["1w"].datestr.map((date, index) => {
      const record = keys.reduce(
        (acc: Record<string, number>, curr: string) => {
          acc[curr] = parseFloat(data.data["1w"].data[curr][index].toFixed(3));
          return acc;
        },
        {}
      );
      return {
        date,
        ...record,
      } as OpaNormalizedData;
    }),
    month: data.data["1m"].datestr.map((date, index) => {
      const record = keys.reduce(
        (acc: Record<string, number>, curr: string) => {
          acc[curr] = parseFloat(data.data["1m"].data[curr][index].toFixed(3));
          return acc;
        },
        {}
      );
      return {
        date,
        ...record,
      } as OpaNormalizedData;
    }),
  };
};

type TermsRes = {
  terms: { key: string; name: string }[];
};
