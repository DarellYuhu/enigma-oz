"use client";

import HorizontalBarChart from "@/components/charts/HorizontalBarChart";

export const BarChart = ({
  item,
  withDomain = false,
}: {
  item: { [key: string]: number };
  withDomain?: boolean;
}) => {
  return (
    <HorizontalBarChart
      data={Object.entries(item).map(([key, val]) => ({
        label: key,
        val: val * 100,
      }))}
      dataKey="val"
      label="Test"
      labelKey="label"
      withDomain={withDomain}
    />
  );
};
