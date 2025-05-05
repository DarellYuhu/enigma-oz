"use client";
import MultipleSelector from "@/components/MultiSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COLORS } from "@/constants";
import survey from "@/data/survey.json";
import { useEffect, useId, useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";
import { capitalize } from "lodash";
import { EnigmaSlider } from "@/components/enigma-slider";

export const SurveyCard = () => {
  const id = useId();
  const [type, setType] = useState<"weekly" | "monthly">("weekly");
  const [margin, setMargin] = useState(false);
  const [opacity, setOpacity] = useState([2]);
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
          record[candidateKey] = {
            value: null,
            survey: null,
            surveyor: null,
            margin: null,
          };
        }

        // Assign weekly value to candidate
        record[candidateKey].value = data[type].value[index];
        record[candidateKey].margin = [
          data[type].high[index],
          data[type].low[index],
        ];
      });

      surveys.timestamp.forEach((timestamp, index) => {
        if (!timestampMap.has(timestamp)) {
          timestampMap.set(timestamp, { date: timestamp });
        }
        const record = timestampMap.get(timestamp)!;

        // Ensure candidate object exists
        if (!record[candidateKey]) {
          record[candidateKey] = {
            value: null,
            survey: null,
            surveyor: null,
            margin: null,
          };
        }

        // Assign surveyor count to candidate
        record[candidateKey].survey = surveys.value[index];
        record[candidateKey].surveyor = surveys.surveyor[index];
      });
    }

    const sorted = Array.from(timestampMap.values()).sort(
      (a, b) => a.date - b.date
    );
    return sorted;
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
    <Card>
      <CardHeader>
        <CardTitle>Surveys</CardTitle>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5">
            <MultipleSelector
              className="w-full"
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
          </div>
          <Select
            value={type}
            onValueChange={(value) => setType(value as typeof type)}
          >
            <SelectTrigger className="h-full col-span-5">
              <SelectValue placeholder={"Select a type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 col-span-2">
            <Checkbox
              id={`${id}-m`}
              checked={margin}
              onCheckedChange={(v) => setMargin(v as boolean)}
            />
            <Label htmlFor={`${id}-m`}>MoE</Label>
          </div>
          <div className="col-span-5">
            <EnigmaSlider
              label="Dot Opacity"
              value={opacity}
              onValueChange={setOpacity}
            />
          </div>
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
              <>
                {margin && (
                  <Area
                    key={`${idx}-m`}
                    name={`Margin - ${value}`}
                    dataKey={`${key}.margin`}
                    fill={COLORS[idx % COLORS.length]}
                    stroke={COLORS[idx % COLORS.length]}
                    dot={false}
                    legendType="none"
                    type={"basis"}
                    connectNulls
                    fillOpacity={0.2}
                    strokeOpacity={0}
                  />
                )}
                <Line
                  key={idx}
                  name={`${capitalize(type)} - ${value}`}
                  dataKey={`${key}.value`}
                  stroke={COLORS[idx % COLORS.length]}
                  dot={false}
                  legendType="none"
                  type={"basis"}
                  connectNulls
                />
                <Scatter
                  key={value}
                  name={`Survey - ${value}`}
                  dataKey={`${key}.survey`}
                  fill={COLORS[idx % COLORS.length]}
                  fillOpacity={opacity[0] * 0.1}
                />
              </>
            ))}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
