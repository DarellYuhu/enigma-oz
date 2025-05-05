"use client";

import MultipleSelector from "@/components/MultiSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COLORS } from "@/constants";
import ETA_DATA from "@/data/prediction_ETA.json";
import PTA_DATA from "@/data/prediction_PTA.json";
import { useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  XAxis,
  YAxis,
} from "recharts";

export default function PredictionPage() {
  const [type, setType] = useState<"ETA" | "PTA">("PTA");
  const [selected, setSelected] = useState<{ label: string; value: string }[]>(
    []
  );

  const data = useMemo(() => {
    const timestampMap = new Map<number, Record<string, any>>();
    const selectedData = type === "ETA" ? ETA_DATA.data : PTA_DATA.data;

    for (const [key, value] of Object.entries(selectedData)) {
      value.timestamp.forEach((element, idx) => {
        if (!timestampMap.has(element)) {
          timestampMap.set(element, { date: element });
        }
        const record = timestampMap.get(element)!;

        // Ensure candidate object exists
        if (!record[key]) {
          record[key] = {
            value: null,
            median: null,
            margin: null,
          };
        }
        record[key].value = value.value[idx] * 100;
        record[key].margin = [value.max[idx] * 100, value.min[idx] * 100];
        record[key].median = value.median[idx] * 100;
      });
    }
    const normalized = Array.from(timestampMap.values()).sort(
      (a, b) => a.date - b.date
    );
    return normalized as {
      value: number;
      median: number;
      margin: [number, number];
      date: number;
    }[];
  }, [type]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Prediction</CardTitle>
          <div className="grid grid-cols-2 gap-4">
            <MultipleSelector
              className="w-full"
              commandProps={{
                label: "Select candidates",
              }}
              value={selected}
              defaultOptions={Object.keys(
                type === "ETA" ? ETA_DATA.data : PTA_DATA.data
              ).map((key) => ({
                label: key,
                value: key,
              }))}
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
                <SelectItem value="PTA">PTA</SelectItem>
                <SelectItem value="ETA">ETA</SelectItem>
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
              data={data}
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
                      const date = new Date(
                        payload[0].payload.date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                      return `${date}`;
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
                <>
                  (
                  <Area
                    key={`${idx}-margin`}
                    name={`Margin - ${value}`}
                    dataKey={`['${key}'].margin`}
                    fill={COLORS[idx % COLORS.length]}
                    stroke={COLORS[idx % COLORS.length]}
                    dot={false}
                    legendType="none"
                    type={"basis"}
                    connectNulls
                    fillOpacity={0.2}
                    strokeOpacity={0}
                  />
                  )
                  <Line
                    key={`${idx}-value`}
                    name={`Value - ${value}`}
                    dataKey={`['${key}'].value`}
                    stroke={COLORS[idx % COLORS.length]}
                    dot={false}
                    legendType="none"
                    type={"basis"}
                    connectNulls
                  />
                  <Line
                    key={`${idx}-median`}
                    name={`Median - ${value}`}
                    dataKey={`['${key}'].median`}
                    stroke={COLORS[idx % COLORS.length]}
                    dot={false}
                    legendType="none"
                    type={"basis"}
                    connectNulls
                  />
                </>
              ))}
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
