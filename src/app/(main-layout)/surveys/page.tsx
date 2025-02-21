"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";
import survey from "@/data/survey.json";
import { useEffect, useMemo, useState } from "react";
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

export default function SurveysPage() {
  const [type, setType] = useState<"weekly" | "monthly">("weekly");
  const [selected, setSelected] = useState<{ label: string; value: string }[]>(
    []
  );
  const normalized = useMemo(() => {
    const timestampMap = new Map<number, Record<string, any>>();

    const filteredCandidates = Object.entries(survey.data)
      .filter(([candidateKey]) =>
        selected.map((s) => s.value).includes(candidateKey)
      )
      .sort((a, b) => a[0].localeCompare(b[0]));

    for (const [candidateKey, candidateData] of filteredCandidates) {
      const { surveys, ...data } = candidateData;

      data[type].timestamp.forEach((timestamp, index) => {
        if (!timestampMap.has(timestamp)) {
          timestampMap.set(timestamp, { date: timestamp });
        }
        const record = timestampMap.get(timestamp)!;

        // Ensure candidate object exists
        if (!record[candidateKey]) {
          record[candidateKey] = { value: null, survey: null, surveyor: null };
        }

        // Assign weekly value to candidate
        record[candidateKey].value = data[type].value[index];
      });

      surveys.timestamp.forEach((timestamp, index) => {
        if (!timestampMap.has(timestamp)) {
          timestampMap.set(timestamp, { date: timestamp });
        }
        const record = timestampMap.get(timestamp)!;

        // Ensure candidate object exists
        if (!record[candidateKey]) {
          record[candidateKey] = { value: null, survey: null, surveyor: null };
        }

        // Assign surveyor count to candidate
        record[candidateKey].survey = surveys.value[index];
        record[candidateKey].surveyor = surveys.surveyor[index];
      });
    }

    return Array.from(timestampMap.values()).sort((a, b) => a.date - b.date);
  }, [selected, type]);

  useEffect(() => {
    if (survey) {
      setSelected(
        Object.entries(survey.candidates)
          .slice(0, 5)
          .map(([key, value]) => ({
            label: value,
            value: key,
          }))
      );
    }
  }, []);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Surveys</CardTitle>
          <div className="grid grid-cols-2 gap-4">
            <MultipleSelector
              commandProps={{
                label: "Select candidates",
              }}
              value={selected}
              defaultOptions={Object.entries(survey.candidates).map(
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
            <Select
              value={type}
              onValueChange={(value) => setType(value as typeof type)}
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
                      const surveyor = payload[0].payload["1"]?.surveyor
                        ? ` - ${payload[0].payload["1"]?.surveyor} surveyor`
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
                dataKey="date"
                type="category"
                tickFormatter={(value: number) =>
                  new Date(value).toLocaleDateString()
                }
              />
              {selected.map(({ label: value, value: key }, idx) => (
                <Line
                  key={idx}
                  name={`Line - ${value}`}
                  dataKey={`${key}.value`}
                  stroke={COLORS[idx % COLORS.length]}
                  dot={false}
                  legendType="none"
                  type={"natural"}
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
    </div>
  );
}
