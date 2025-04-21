"use client";

import { BaseMap } from "@/components/base-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GLASBEY_COLORS } from "@/constants";
import data from "@/data/candidate_rank_region.json";
import { Fragment, useMemo } from "react";
import PH_JSON from "@/data/geojson/ph.json";
import RechartDoughnut from "@/components/charts/RechartDoughnut";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const RegionRank = () => {
  const colors = useMemo(() => {
    const colorMap = new Map<string, string>();
    let colorIdx = 0;
    Object.values(data.data).forEach((val) => {
      val.forEach((item) => {
        if (!colorMap.has(item.candidate)) {
          colorMap.set(item.candidate, GLASBEY_COLORS[colorIdx]);
          colorIdx++;
        }
      });
    });
    return colorMap;
  }, [data]);

  return (
    <BaseMap
      layerData={Object.entries(data.data).map(([key, values]) => {
        return {
          alpha: 0.4,
          color: colors.get(values[0].candidate)!,
          rid: key,
          data: { key, values },
        };
      })}
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
              <ScrollArea className="h-40">
                <div className="grid grid-cols-12 gap-x-2">
                  {data?.values.map((item, index) => (
                    <Fragment key={index}>
                      <div
                        className={
                          "col-span-1 shrink-0 rounded-[2px] h-2.5 w-2.5 self-center"
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
                <ScrollBar className="bg-white" />
              </ScrollArea>
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
