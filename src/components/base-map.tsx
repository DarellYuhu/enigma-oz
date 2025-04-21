"use client";

import { Layer, Map as MapGl, Source } from "react-map-gl";
import { useTheme } from "next-themes";
import PH_JSON from "@/data/geojson/ph.json";
import { useCallback, useState } from "react";

export const MAP_THEME = {
  light: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

type props<T = unknown> = {
  layerData?: { rid: string; color: string; alpha: number; data?: T }[];
  renderTooltip?: (data?: T) => React.ReactNode;
};

export const BaseMap = <T = unknown,>({
  layerData,
  renderTooltip,
}: props<T>) => {
  const { theme } = useTheme();
  const [feature, setFeature] = useState<{
    data?: T;
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
      const data = layerData?.find(
        (f) => f.rid === hoveredFeature?.properties!.regcode
      );
      setFeature(
        hoveredFeature
          ? {
              data: data?.data,
              x: offsetX,
              y: offsetY,
            }
          : null
      );
    },
    [layerData]
  );

  return (
    <MapGl
      interactiveLayerIds={["geo-json"]}
      mapStyle={theme === "dark" ? MAP_THEME.dark : MAP_THEME.light}
      style={{ width: "100%", height: "100%" }}
      onMouseMove={onMouseMove}
      initialViewState={{
        longitude: 122.4,
        latitude: 11.8,
        zoom: 4,
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
            "fill-color": layerData
              ? {
                  type: "categorical",
                  property: "regcode",
                  stops: layerData.map((item) => [item.rid, item.color]),
                }
              : "transparent",
            "fill-opacity": {
              type: "categorical",
              property: "regcode",
              default: 0,
              stops: layerData?.map((item) => [item.rid, item.alpha]),
            },
          }}
        />
      </Source>
      {feature && (
        <div
          style={{
            position: "absolute",
            top: feature.y,
            left: feature.x,
            zIndex: 100,
          }}
        >
          {renderTooltip?.(feature.data)}
        </div>
      )}
    </MapGl>
  );
};
