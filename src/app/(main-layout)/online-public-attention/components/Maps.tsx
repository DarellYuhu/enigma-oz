"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useConfigStore from "../store/config-store";
import dateFormatter from "@/utils/dateFormatter";
import useGeoJson from "@/hooks/features/trends/useGeoJson";
import { Fragment, useCallback, useState } from "react";
import { Layer, Map as MapGl, Source } from "react-map-gl";
import { useTheme } from "next-themes";
import PH_JSON from "@/data/geojson/ph.json";
import { MAP_THEME } from "@/constants";
import useTrends from "@/hooks/features/trends/useTrends";
import SingleSelect from "@/components/SingleSelect";
import { Skeleton } from "@/components/ui/skeleton";
import RechartDoughnut from "@/components/charts/RechartDoughnut";

const Maps = ({ details }: { details: string }) => {
  const [type, setType] = useState<"pct_total" | "1w" | "1m">("1m");
  const { theme } = useTheme();
  const { category, since, until, level } = useConfigStore();
  const trends = useTrends({
    category,
    level,
    details,
    since: since!,
    until: until!,
  });
  const geoJson = useGeoJson({
    category,
    since: since && dateFormatter("ISO", since),
    until: until && dateFormatter("ISO", until),
  });
  const [feature, setFeature] = useState<{
    data?: NonNullable<ReturnType<typeof useGeoJson>["data"]>[0];
    x: number;
    y: number;
  } | null>(null);

  const onMouseMove = useCallback(
    (event: mapboxgl.MapLayerMouseEvent) => {
      const {
        features,
        originalEvent: { offsetX, offsetY },
      } = event;
      const hoveredFeature = features && features[0];

      const data = geoJson.data?.find(
        (f) => f.rid === hoveredFeature?.properties!.regcode
      );

      setFeature(
        hoveredFeature
          ? {
              data,
              x: offsetX,
              y: offsetY,
            }
          : null
      );
    },
    [geoJson.data]
  );

  if (geoJson.isPending) return <Skeleton className="h-80 w-full" />;
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Maps</CardTitle>
      </CardHeader>
      <CardContent className="h-[450px] w-full">
        {geoJson.data && trends.data && (
          <>
            <MapGl
              onRender={(e) => e.target.resize()}
              interactiveLayerIds={["geo-json"]}
              initialViewState={{
                longitude: 122.4,
                latitude: 11.8,
                zoom: 4,
              }}
              style={{ width: "100%", height: "100%" }}
              mapStyle={theme === "dark" ? MAP_THEME.dark : MAP_THEME.light}
              onMouseMove={onMouseMove}
              onClick={(e) => {
                if (e.features && e.features[0])
                  window.open(
                    `/trends/${e.features[0].properties!.regcode}`,
                    "_blank"
                  );
              }}
            >
              <Source
                type="geojson"
                data={PH_JSON as GeoJSON.FeatureCollection<GeoJSON.Geometry>}
              >
                <Layer
                  id={"geo-json"}
                  key={"geo-json"}
                  type="fill"
                  paint={{
                    "fill-color": {
                      type: "categorical",
                      property: "regcode",
                      stops: geoJson.data.map((item) => [
                        item.rid,
                        trends.data.colors[item[type][0].key],
                      ]),
                    },
                    "fill-opacity": 0.5,
                  }}
                />
              </Source>
              {feature && (
                <Card
                  className="backdrop-blur-md bg-white/30"
                  style={{
                    top: feature.y,
                    left: feature.x,
                    position: "absolute",
                    zIndex: 100,
                  }}
                >
                  <CardHeader>
                    <CardTitle>{feature.data?.region}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row">
                    <div className="grid grid-cols-12 gap-x-2">
                      {feature.data?.[type].map((item, index) => (
                        <Fragment key={index}>
                          <div
                            className={
                              "col-span-1 shrink-0 rounded-[2px] h-2.5 w-2.5 self-center"
                            }
                            style={{
                              backgroundColor: trends.data.colors[item.key],
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
                        {feature.data && (
                          <RechartDoughnut
                            tooltip={false}
                            outerRadius={40}
                            innerRadius={20}
                            config={feature.data[type].reduce((acc, curr) => {
                              acc[curr.key] = {
                                label: curr.name,
                                color: trends.data.colors[curr.key],
                              };
                              return acc;
                            }, {} as Record<string, { label: string; color: string }>)}
                            data={feature.data[type].map((item) => ({
                              ...item,
                              fill: trends.data.colors[item.key],
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
            </MapGl>
          </>
        )}
      </CardContent>
      <div className="absolute top-4 right-6">
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

export default Maps;
