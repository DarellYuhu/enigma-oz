"use client";
import { useMemo } from "react";
import chroma from "chroma-js";
import { BaseMap } from "./base-map";
import PH_JSON from "@/data/geojson/ph.json";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const Maps = ({ item }: { item: { [key: string]: number } }) => {
  const colors = useMemo(() => {
    const max = Math.max(...Object.values(item).map((v) => v));
    const min = 0;
    const range = 0.5 - min;
    const colorMap = Object.entries(item).map(([key, val]) => {
      const alpha = (val / max) * range + min;
      return [key, { alpha, color: chroma("red").hex() }];
    });
    return Object.fromEntries(colorMap);
  }, [item]);

  return (
    <BaseMap
      layerData={Object.entries(item).map(([key, value]) => ({
        data: {
          value,
          name: PH_JSON.features.find((item) => item.properties.regcode === key)
            ?.properties.regname,
        },
        rid: key,
        alpha: colors[key].alpha,
        color: colors[key].color,
      }))}
      renderTooltip={(data) => (
        <Card>
          <CardHeader>
            <CardTitle>{data?.name}</CardTitle>
          </CardHeader>
        </Card>
      )}
    />
  );
};
