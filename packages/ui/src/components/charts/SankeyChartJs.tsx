"use client";

import { SankeyController, Flow } from "chartjs-chart-sankey";
import {
  Chart,
  Tooltip,
  Legend,
  TooltipOptions,
  LinearScale,
  CategoryScale,
  ChartTypeRegistry,
  TooltipItem,
} from "chart.js";
import { Chart as ChartJs } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import { HashtagEvolution } from "@/hooks/features/twitter/useTwitterHashtagEvo";
import generateNodeColors from "@/utils/generateNodeColors";
import { GlobalEvolutionData } from "@/hooks/features/tiktok/useGlobalEvolution";
import { useEffect } from "react";

Chart.register(
  SankeyController,
  Flow,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  zoomPlugin
);

const SankeyChartJs = ({ item }: { item: HashtagEvolution }) => {
  const objectMap = (
    obj: GlobalEvolutionData["thread"],
    fn: (v: GlobalEvolutionData["thread"][0]) => void
  ) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));

  const colors =
    item.class &&
    Object.values(
      generateNodeColors(
        Array.from({ length: 10 }).map((_, index) => index.toString())
      )
    );
  const assigned: Record<string, string> = {};
  const cv = (name: string) => {
    if (!colors) return "#808080";
    return (
      assigned[name] ||
      (assigned[name] = colors[Object.keys(assigned).length % colors.length])
    );
  };
  const option: any = {
    labels: item["class"]
      ? objectMap(item["thread"], (v) => item["class"]?.[v["class"]])
      : Object.fromEntries(
          Object.entries(item.thread).map(([key, item]) => [key, item.class])
        ),
    borderWidth: 2,
    borderColor: "black",
    alpha: 0.2,
    label: "My sankey",
    data: item.flow,
    colorMode: "gradient",
    column: Object.fromEntries(
      Object.entries(item.thread).map(([key, item]) => [key, item.window])
    ),

    priority: Object.fromEntries(
      Object.entries(item.thread).map(([key, item]) => [key, item.window])
    ),
    size: "max", // or 'min' if flow overlap is preferred
  };
  const data = {
    labels: ["From", "To", "Flow"],
    datasets: [option],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    font: { size: item.class ? 10 : 15 },
    sankey: {
      node: {
        label: {
          fontName: "Times-Roman",
          bold: true,
          italic: true,
        },
      },
    },
    plugins: {
      // zoom: {
      //   pan: {
      //     enabled: true,
      //     mode: "xy",
      //   },
      //   zoom: {
      //     wheel: {
      //       enabled: true,
      //     },
      //     pinch: {
      //       enabled: true,
      //     },
      //     mode: "xy",
      //   },
      // },
      legend: { position: "top" as const },
      colors: {
        forceOverride: true,
      },
      tooltip: {
        usePointStyle: false,
        enabled: true,
        callbacks: {
          label: ({
            raw,
          }: TooltipItem<keyof ChartTypeRegistry> & {
            raw: HashtagEvolution["flow"][0];
          }) => {
            return [
              "From: " +
                item.thread[raw.from].class +
                " " +
                item.window[item.thread[raw.from].window],

              "To: " +
                item.thread[raw?.to].class +
                " " +
                item.window[item.thread[raw.to].window],
              "Flow: " + raw?.flow,
            ];
          },
        },
      } as TooltipOptions,
    },
    scales: {
      x: {
        display: true,
        ticks: {
          beginAtZero: true,
          callback: function (value: string) {
            if (Number.isInteger(value)) {
              return item["window"][value];
            }
          },
          stepSize: 1,
        },
      },
      y: { type: "linear", reverse: true, offset: true },
    },
  };

  useEffect(() => {
    if (item.class) {
      option.colorFrom = (c: any) =>
        item.class &&
        cv(
          item["class"][
            item["thread"][c.dataset.data[c.dataIndex].from]["class"]
          ].split(" | ")[0]
        );
      option.colorTo = (c: any) =>
        item.class &&
        cv(
          item["class"][
            item["thread"][c.dataset.data[c.dataIndex].to]["class"]
          ].split(" | ")[0]
        );
    }
  }, [item]);

  // @ts-ignore
  return <ChartJs type="sankey" data={data as any} options={options} />;
};

export default SankeyChartJs;
