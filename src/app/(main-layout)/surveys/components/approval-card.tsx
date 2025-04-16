"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import approval from "@/data/approval.json";
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
import { useId, useMemo, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Approval, normalizeApproval } from "./normalize-approval";
import { capitalize, uniq } from "lodash";
import { EnigmaSlider } from "@/components/enigma-slider";

type Entry = {
  date: number;
} & Record<
  string,
  Record<
    "approve" | "disapprove" | "undecided",
    {
      surveyor: string | null;
      survey: number | null;
      value: number | null;
      margin: [number, number] | null;
    }
  >
>;

export const ApprovalCard = () => {
  const id = useId();
  const [opacity, setOpacity] = useState([2]);
  const [margin, setMargin] = useState(false);
  const [seriesType, setSeriesType] = useState<"weekly" | "monthly">("weekly");
  const [selected, setSelected] = useState<{ label: string; value: string }[]>(
    []
  );
  const [type, setType] = useState({
    approve: true,
    disapprove: false,
    undecided: false,
  });

  const normalized = useMemo(() => {
    const officialIds = Object.keys(approval.data);
    const approve = normalizeApproval(
      approval as unknown as Approval,
      seriesType,
      "approve",
      officialIds
    );
    const disapprove = normalizeApproval(
      approval as unknown as Approval,
      seriesType,
      "disapprove",
      officialIds
    );
    const undecided = normalizeApproval(
      approval as unknown as Approval,
      seriesType,
      "undecided",
      officialIds
    );

    const allDates = uniq(
      [...approve.allDates, ...disapprove.allDates, ...undecided.allDates].sort(
        (a, b) => a - b
      )
    );

    // Build the normalized result: one entry per unique date.
    const result = allDates.map((date) => {
      const entry = { date } as Entry;
      officialIds.forEach((id) => {
        entry[id] = {
          approve: {
            surveyor: approve.officialMaps[id].surveysMap.hasOwnProperty(date)
              ? approve.officialMaps[id].surveysMap[date]
              : null,
            survey: approve.officialMaps[id].surveyValueMap.hasOwnProperty(date)
              ? approve.officialMaps[id].surveyValueMap[date]
              : null,
            value: approve.officialMaps[id].weeklyMap.hasOwnProperty(date)
              ? approve.officialMaps[id].weeklyMap[date]
              : null,
            margin: approve.officialMaps[id].marginMap.hasOwnProperty(date)
              ? approve.officialMaps[id].marginMap[date]
              : null,
          },
          disapprove: {
            surveyor: disapprove.officialMaps[id].surveysMap.hasOwnProperty(
              date
            )
              ? disapprove.officialMaps[id].surveysMap[date]
              : null,
            survey: disapprove.officialMaps[id].surveyValueMap.hasOwnProperty(
              date
            )
              ? disapprove.officialMaps[id].surveyValueMap[date]
              : null,
            value: disapprove.officialMaps[id].weeklyMap.hasOwnProperty(date)
              ? disapprove.officialMaps[id].weeklyMap[date]
              : null,
            margin: disapprove.officialMaps[id].marginMap.hasOwnProperty(date)
              ? disapprove.officialMaps[id].marginMap[date]
              : null,
          },
          undecided: {
            surveyor: undecided.officialMaps[id].surveysMap.hasOwnProperty(date)
              ? undecided.officialMaps[id].surveysMap[date]
              : null,
            survey: undecided.officialMaps[id].surveyValueMap.hasOwnProperty(
              date
            )
              ? undecided.officialMaps[id].surveyValueMap[date]
              : null,
            value: undecided.officialMaps[id].weeklyMap.hasOwnProperty(date)
              ? undecided.officialMaps[id].weeklyMap[date]
              : null,
            margin: undecided.officialMaps[id].marginMap.hasOwnProperty(date)
              ? undecided.officialMaps[id].marginMap[date]
              : null,
          },
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
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`${id}-a`}
                checked={type.approve}
                onCheckedChange={(value) =>
                  setType({ ...type, approve: value as boolean })
                }
              />
              <Label htmlFor={`${id}-a`}>Approve</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`${id}-b`}
                checked={type.disapprove}
                onCheckedChange={(value) =>
                  setType({ ...type, disapprove: value as boolean })
                }
              />
              <Label htmlFor={`${id}-b`}>Disapprove</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`${id}-c`}
                checked={type.undecided}
                onCheckedChange={(value) =>
                  setType({ ...type, undecided: value as boolean })
                }
              />
              <Label htmlFor={`${id}-c`}>Undecided</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`${id}-d`}
                checked={margin}
                onCheckedChange={(v) => setMargin(v as boolean)}
              />
              <Label htmlFor={`${id}-d`}>MoE</Label>
            </div>
          </div>
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
          <div className="col-span-1">
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
                    )[0] as { approve: { surveyor?: string } };
                    console.log(payload);
                    const surveyor = firstObject?.approve.surveyor
                      ? ` - ${firstObject?.approve.surveyor} surveyor`
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

            <Legend
              formatter={(value: string) => {
                return value;
              }}
            />

            <YAxis domain={[0, 100]} />
            <XAxis
              domain={["dataMin", "dataMax"]}
              dataKey="date"
              type="number"
              tickFormatter={(value: number) =>
                new Date(value).toLocaleDateString()
              }
            />

            {Object.entries(type).map(
              ([typeKey, value], typeIdx) =>
                value && (
                  <>
                    {selected.map(({ label: value, value: key }, idx) => (
                      <>
                        {margin && (
                          <Area
                            key={`${idx}-m-${typeKey}`}
                            name={`Margin - ${value}`}
                            dataKey={`${key}.${typeKey}.margin`}
                            stroke={
                              COLORS[(idx % COLORS.length) + (typeIdx + 1)]
                            }
                            fill={COLORS[(idx % COLORS.length) + (typeIdx + 1)]}
                            dot={false}
                            legendType="none"
                            type={"basis"}
                            connectNulls
                            fillOpacity={0.2}
                            strokeOpacity={0}
                          />
                        )}
                        <Line
                          key={`${idx}-${typeKey}`}
                          name={`${capitalize(seriesType)} - ${value}`}
                          dataKey={`${key}.${typeKey}.value`}
                          stroke={COLORS[(idx % COLORS.length) + (typeIdx + 1)]}
                          dot={false}
                          legendType="none"
                          type={"basis"}
                          connectNulls
                        />
                        <Scatter
                          key={`${value}-${typeKey}`}
                          name={`${capitalize(typeKey)} - ${value}`}
                          dataKey={`${key}.${typeKey}.survey`}
                          fill={COLORS[(idx % COLORS.length) + (typeIdx + 1)]}
                          fillOpacity={opacity[0] * 0.1}
                        />
                      </>
                    ))}
                  </>
                )
            )}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
