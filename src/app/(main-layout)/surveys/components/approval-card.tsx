"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import approval from "@/data/approval.json";
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";
import { COLORS } from "@/constants";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import MultipleSelector from "@/components/MultiSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Approval = {
  data: Record<
    string,
    Record<
      "approve" | "disapprove" | "undecided",
      Record<
        "surveys" | "monthly" | "weekly",
        {
          date_str: string[];
          timestamp: number[];
          surveyor: string[];
          value: number[];
        }
      >
    >
  >;
  officials: Record<number, string>;
};
export const ApprovalCard = () => {
  const [selected, setSelected] = useState<{ label: string; value: string }[]>(
    []
  );
  const [seriesType, setSeriesType] = useState<
    "surveys" | "weekly" | "monthly"
  >("weekly");
  const [type, setType] = useState<"approve" | "disapprove" | "undecided">(
    "approve"
  );

  const normalized = useMemo(() => {
    const officialIds = Object.keys(approval.data);
    const allTimestampsSet = new Set<number>();

    // Collect timestamps from both surveys and weekly for every official.
    officialIds.forEach((id) => {
      const approveData = (approval.data as unknown as Approval["data"])[id][
        type
      ];
      if (approveData.surveys?.timestamp) {
        approveData.surveys.timestamp.forEach((ts) => allTimestampsSet.add(ts));
      }
      if (approveData[seriesType]?.timestamp) {
        approveData[seriesType].timestamp.forEach((ts) =>
          allTimestampsSet.add(ts)
        );
      }
    });

    // Create a sorted array of all unique timestamps.
    const allDates = Array.from(allTimestampsSet).sort((a, b) => a - b);

    // Build lookup maps for each official:
    // - surveysMap: timestamp -> surveyor
    // - surveyValueMap: timestamp -> survey branch's value
    // - weeklyMap: timestamp -> weekly branch's value
    const officialMaps: Record<
      string,
      {
        surveysMap: Record<number, string | null>;
        surveyValueMap: Record<number, number | null>;
        weeklyMap: Record<number, number | null>;
      }
    > = {};
    officialIds.forEach((id) => {
      const { surveys, ...data } = (
        approval.data as unknown as Approval["data"]
      )[id][type];
      const surveysMap: Record<number, string | null> = {};
      const surveyValueMap: Record<number, number | null> = {};
      if (surveys?.timestamp) {
        for (let i = 0; i < surveys.timestamp.length; i++) {
          surveysMap[surveys.timestamp[i]] = surveys.surveyor[i] || null;
          surveyValueMap[surveys.timestamp[i]] = surveys.value[i] ?? null;
        }
      }
      const weeklyMap: Record<number, number | null> = {};
      if (data[seriesType as unknown as "weekly" | "monthly"]?.timestamp) {
        for (
          let i = 0;
          i <
          data[seriesType as unknown as "weekly" | "monthly"].timestamp.length;
          i++
        ) {
          weeklyMap[
            data[seriesType as unknown as "weekly" | "monthly"].timestamp[i]
          ] =
            data[seriesType as unknown as "weekly" | "monthly"].value[i] ??
            null;
        }
      }
      officialMaps[id] = { surveysMap, surveyValueMap, weeklyMap };
    });

    // Build the normalized result: one entry per unique date.
    const result = allDates.map((date) => {
      const entry = { date } as {
        date: number;
      } & Record<
        string,
        {
          surveyor: string | null;
          survey: number | null;
          value: number | null;
        }
      >;
      officialIds.forEach((id) => {
        entry[id] = {
          surveyor: officialMaps[id].surveysMap.hasOwnProperty(date)
            ? officialMaps[id].surveysMap[date]
            : null,
          survey: officialMaps[id].surveyValueMap.hasOwnProperty(date)
            ? officialMaps[id].surveyValueMap[date]
            : null,
          value: officialMaps[id].weeklyMap.hasOwnProperty(date)
            ? officialMaps[id].weeklyMap[date]
            : null,
        };
      });
      return entry;
    });

    return result;
  }, [approval, type, seriesType]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval</CardTitle>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-full">
            <MultipleSelector
              commandProps={{
                label: "Select candidates",
              }}
              value={selected}
              defaultOptions={Object.entries(approval.officials).map(
                ([key, value]) => ({
                  label: value,
                  value: key,
                })
              )}
              onChange={setSelected}
              placeholder="Select candidates"
              hideClearAllButton
              hidePlaceholderWhenSelected
              emptyIndicator={
                <p className="text-center text-sm">No results found</p>
              }
            />
          </div>
          <Select
            value={type}
            onValueChange={(value) => setType(value as typeof type)}
          >
            <SelectTrigger className="h-full">
              <SelectValue placeholder={"Select a type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approve">Approve</SelectItem>
              <SelectItem value="disapprove">Disapprove</SelectItem>
              <SelectItem value="undecided">Undecided</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={seriesType}
            onValueChange={(value) => setSeriesType(value as typeof seriesType)}
          >
            <SelectTrigger className="h-full">
              <SelectValue placeholder={"Select a type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[500px]">
        <ChartContainer
          className={"w-full h-full"}
          config={{ date: { label: "Date" } }}
        >
          <ComposedChart
            width={500}
            height={400}
            data={normalized}
            margin={{
              top: 20,
              right: 80,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelKey="date"
                  labelFormatter={(_, payload) => {
                    const firstObject = Object.values(
                      payload[0].payload
                    )[0] as { surveyor?: string };
                    const surveyor = firstObject?.surveyor
                      ? ` - ${firstObject?.surveyor} surveyor`
                      : "";
                    const date = new Date(
                      payload[0].payload.date
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    return `${date}${surveyor}`;
                  }}
                />
              }
            />

            <Legend formatter={(value: string) => value.split("-")[1]} />

            <YAxis domain={[0, 100]} />
            <XAxis
              domain={["dataMin", "dataMax"]}
              dataKey="date"
              type="number"
              tickFormatter={(value: number) =>
                new Date(value).toLocaleDateString()
              }
            />
            {selected.map(({ label: value, value: key }, idx) => (
              <Line
                key={idx}
                name={`${seriesType} - ${value}`}
                dataKey={`${key}.value`}
                stroke={COLORS[idx % COLORS.length]}
                dot={false}
                legendType="none"
                type={"basis"}
                connectNulls
              />
            ))}
            {selected.map(({ label: value, value: key }, idx) => (
              <Scatter
                key={value}
                name={`Survey - ${value}`}
                dataKey={`${key}.survey`}
                fill={COLORS[idx % COLORS.length]}
                fillOpacity={0.2}
              />
            ))}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
