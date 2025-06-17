import { TimeSeries } from "./components/time-series";
import { format, subYears } from "date-fns";
import axios from "axios";
import generateNodeColors from "@/utils/generateNodeColors";
import { Maps } from "./components/maps";

type Params = {
  searchParams: {
    period?: string;
    selected?: string;
    date_range?: string;
  };
};

export default async function TopicsPage({ searchParams }: Params) {
  const { selected, date_range } = searchParams;
  const terms = (
    await axios.post<TermsRes>("http://172.233.75.107:8912/api/queries")
  ).data;
  const dateRange = date_range
    ? date_range.split(",")
    : [
        format(subYears(new Date(), 1), "yyyy-MM-dd"),
        format(new Date(), "yyyy-MM-dd"),
      ];
  const timeseries = (
    await axios.post<OpaRes>("http://172.233.75.107:8912/api/terms", {
      type: "get-trends-terms",
      terms: selected ?? "1 2 3",
      level: "1",
      since: dateRange[0],
      until: dateRange[1],
      details: "PH",
    })
  ).data;
  const geoData = (
    await axios.post<OpaGeoRes>("http://172.233.75.107:8912/api/geo", {
      type: "get-region-top-terms",
      category: selected ?? "1 2 3",
      level: "1",
      since: dateRange[0],
      until: dateRange[1],
      details: "PH",
    })
  ).data.map(({ pct_last, ...item }) => ({ ...item, ...pct_last }));
  const colors = generateNodeColors(
    terms.terms.map((t) => t.key),
    "random"
  );
  const normalized = normalizeTimeseries(timeseries);

  return (
    <div className="space-y-4">
      <TimeSeries
        options={terms.terms.map((t) => ({ label: t.name, value: t.key }))}
        dic={timeseries.dic}
        colors={colors}
        data={normalized}
      />

      <Maps colors={colors} data={geoData} />
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
