"use client";

import SingleSelect from "@/components/SingleSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fragment, useMemo, useState } from "react";
import RechartDoughnut from "@/components/charts/RechartDoughnut";
import { BaseMap } from "@/components/base-map";

type KeyIndex = "1m" | "1w" | "pct_total";

type Params = {
  data: ({
    [key in KeyIndex]: PctData[];
  } & {
    region: string;
    rid: string;
  })[];
  colors: Record<string, string>;
  options: { label: string; value: string }[];
};

export const Maps = ({ data, colors, options }: Params) => {
  const [type, setType] = useState<"1m" | "1w" | "pct_total">("1m");
  const [selected, setSelected] = useState<string>("all");

  const intensityData = useMemo(() => {
    if (selected === "all") return [];
    let max = 0;
    const normalized = data.map((item) => {
      const data = item[type].filter((item) => item.key === selected)[0];
      if (data.value > max) max = data.value;
      return {
        alpha: 0,
        color: colors[data.key],
        rid: item.rid,
        data: { ...data, region: item.region },
      };
    });
    normalized.forEach((item) => (item.alpha = (item.data.value / max) * 0.6));
    return normalized;
  }, [selected, type, data, colors]);

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Maps</CardTitle>
      </CardHeader>
      <CardContent className="h-[450px] w-full">
        {selected === "all" ? (
          <BaseMap
            layerData={data.map((item) => ({
              alpha: 0.5,
              color: colors[item[type][0].key],
              rid: item.rid,
              data: item,
            }))}
            renderTooltip={(data) => (
              <Card className="backdrop-blur-md bg-white/30">
                <CardHeader>
                  <CardTitle>{data?.region}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row">
                  <div className="grid grid-cols-12 gap-x-2">
                    {data?.[type].map((item, index) => (
                      <Fragment key={index}>
                        <div
                          className={
                            "col-span-1 shrink-0 rounded-[2px] h-2.5 w-2.5 self-center"
                          }
                          style={{
                            backgroundColor: colors[item.key],
                          }}
                        />
                        <span className="col-span-7">
                          #{item.rank} {item.name}:
                        </span>
                        <div className="col-span-4">
                          {(item.value * 100).toFixed(2)}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div>
                    <div className="h-20 w-20">
                      {data && (
                        <RechartDoughnut
                          tooltip={false}
                          outerRadius={40}
                          innerRadius={20}
                          config={data[type].reduce((acc, curr) => {
                            acc[curr.key] = {
                              label: curr.name,
                              color: colors[curr.key],
                            };
                            return acc;
                          }, {} as Record<string, { label: string; color: string }>)}
                          data={data[type].map((item) => ({
                            ...item,
                            fill: colors[item.key],
                          }))}
                          dataKey="value"
                          labelKey="key"
                          legend={false}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          />
        ) : (
          <BaseMap
            layerData={intensityData}
            renderTooltip={(data) => (
              <Card className="backdrop-blur-md bg-white/30">
                <CardHeader>
                  <CardTitle>{data?.region}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row">
                  <div className="grid grid-cols-12 gap-x-2">
                    {data && (
                      <Fragment>
                        <div
                          className={
                            "col-span-1 shrink-0 rounded-[2px] h-2.5 w-2.5 self-center"
                          }
                          style={{
                            backgroundColor: colors[data.key],
                          }}
                        />
                        <span className="col-span-7">
                          #{data.rank} {data.name}:
                        </span>
                        <div className="col-span-4">
                          {(data.value * 100).toFixed(2)}
                        </div>
                      </Fragment>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          />
        )}
      </CardContent>
      <div className="absolute top-4 right-6 flex flex-row gap-2">
        <SingleSelect
          selections={options}
          setValue={setSelected}
          value={selected}
        />
        <SingleSelect
          selections={selections}
          value={type}
          setValue={(value) => setType(value as typeof type)}
        />
      </div>
    </Card>
  );
};

const selections = [
  {
    label: "Last 1m",
    value: "1m",
  },
  {
    label: "Last 1w",
    value: "1w",
  },
  {
    label: "Total",
    value: "pct_total",
  },
];
