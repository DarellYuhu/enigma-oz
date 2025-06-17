"use client";
import RechartMultiLine from "@/components/charts/RechartMultiLine";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useTrends from "@/hooks/features/trends/useTrends";
import dateFormatter from "@/utils/dateFormatter";
import useConfigStore from "../store/config-store";
import SingleSelect from "@/components/SingleSelect";
import MultipleSelector from "@/components/MultiSelect";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TimeSeries = ({ details }: { details: string }) => {
  const { category, level, since, until, type, setType } = useConfigStore();
  const [selected, setSelected] =
    useState<{ label: string; value: string }[]>();
  const { data, isPending } = useTrends({
    category,
    level,
    details,
    since: since!,
    until: until!,
  });

  const timeSeriesData = useCallback(() => {
    if (!data) return null;
    return data.normalized[type].map((item, index) => {
      const record = selected?.reduce((acc: Record<string, number>, curr) => {
        acc[curr.value] = parseFloat(
          data.normalized[type][index][curr.value] as string
        );
        return acc;
      }, {});
      return {
        date: item.date,
        ...record,
      };
    });
  }, [data, selected, type]);

  useEffect(() => {
    if (data) {
      setSelected(
        data.rank.week
          .slice(0, 5)
          .map((item) => ({ label: item.name, value: item.key }))
      );
    }
  }, [data]);

  if (isPending) return <Skeleton className="h-80 w-full" />;

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Series</CardTitle>
        <CardDescription>
          {dateFormatter("DMY", new Date(data.normalized[type][0].date))} -{" "}
          {dateFormatter(
            "DMY",
            new Date(
              data.normalized[type][data.normalized[type].length - 1].date
            )
          )}
        </CardDescription>
        <div className="flex gap-2">
          <SingleSelect
            selections={selections}
            value={type}
            setValue={(value) => setType(value as typeof type)}
          />
          <MultipleSelector
            commandProps={{
              label: "Select frameworks",
            }}
            value={selected}
            defaultOptions={data.data.dic.map((item) => ({
              label: item.name,
              value: item.key,
            }))}
            onChange={setSelected}
            placeholder="Select frameworks"
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={
              <p className="text-center text-sm">No results found</p>
            }
          />
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <RechartMultiLine
          config={data.data.dic.map((item) => ({
            color: data.colors[item.key],
            dataKey: item.key,
            label: item.name,
            labelKey: "date",
          }))}
          data={
            selected?.length !== 0 ? timeSeriesData()! : data.normalized[type]
          }
          tickFormatter={(value) =>
            value
              ? new Date(value).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                })
              : ""
          }
        />
      </CardContent>
    </Card>
  );
};

const selections = [
  {
    value: "week",
    label: "Weekly",
  },
  {
    value: "month",
    label: "Monthly",
  },
];

export default TimeSeries;
