"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Props = {
  data: any[];
  dataKey: string;
  labelKey: string;
  label: string;
  xAxisHide?: boolean;
};

export const RechartArea = (props: Props) => {
  return (
    <ChartContainer
      className="h-full w-full"
      config={
        {
          [props.dataKey]: {
            label: props.label,
            color: "hsl(var(--chart-1))",
          },
        } satisfies ChartConfig
      }
    >
      <AreaChart
        accessibilityLayer
        data={props.data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={props.labelKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => new Date(value).toLocaleDateString("en-US")}
          hide={props.xAxisHide}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey={props.dataKey}
          type="basis"
          fill="#22c55e"
          fillOpacity={0.4}
          stroke="#22c55e"
        />
      </AreaChart>
    </ChartContainer>
  );
};
