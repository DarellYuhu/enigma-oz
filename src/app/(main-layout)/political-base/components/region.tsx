"use client";

import { BaseMap } from "@/components/base-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SECONDARY_COLORS } from "@/constants";
import { Fragment, useMemo } from "react";
import data from "@/data/politicalbase_region.json";
import PH_JSON from "@/data/geojson/ph.json";
import RechartDoughnut from "@/components/charts/RechartDoughnut";

export const Region = () => {
  const colors = useMemo(() => {
    const colorMap = new Map<string, string>();
    let colorIdx = 0;
    Object.values(data.data).forEach((val) => {
      val.forEach((item) => {
        if (!colorMap.has(item.candidate)) {
          colorMap.set(item.candidate, SECONDARY_COLORS[colorIdx]);
          colorIdx++;
        }
      });
    });
    return colorMap;
  }, [data]);

  return (
    <BaseMap
      layerData={Object.entries(data.data).map(([key, val]) => ({
        alpha: 0.4,
        color: colors.get(val[0].candidate)!,
        rid: key,
        data: { key, values: val },
      }))}
      renderTooltip={(data) => {
        return (
          <Card className="backdrop-blur-md bg-white/30">
            <CardHeader>
              <CardTitle>
                {
                  PH_JSON.features.find(
                    (f) => f.properties.regcode === data?.key
                  )?.properties.regname
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row">
              <div className="grid grid-cols-12 gap-x-2 items-center">
                {data?.values.map((item, index) => (
                  <Fragment key={index}>
                    <div
                      className={
                        "col-span-1 shrink-0 rounded-[2px] h-2.5 w-2.5"
                      }
                      style={{
                        backgroundColor: colors.get(item.candidate),
                      }}
                    />
                    <span className="col-span-7">
                      #{item.rank} {item.candidate}:
                    </span>
                    <div className="col-span-4">{item.value.toFixed(2)}</div>
                  </Fragment>
                ))}
              </div>
              <div>
                <div className="h-20 w-20">
                  <RechartDoughnut
                    tooltip={false}
                    outerRadius={40}
                    innerRadius={20}
                    config={data!.values.reduce((acc, curr) => {
                      acc[curr.candidate] = {
                        label: curr.candidate,
                        color: colors.get(curr.candidate)!,
                      };
                      return acc;
                    }, {} as Record<string, { label: string; color: string }>)}
                    data={data!.values.map((item) => ({
                      ...item,
                      fill: colors.get(item.candidate)!,
                    }))}
                    dataKey="value"
                    labelKey="key"
                    legend={false}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }}
    />
  );
};
