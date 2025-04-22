"use client";

import { SECONDARY_COLORS } from "@/constants";
import { Legend, Pie, PieChart as RePieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function PieChart({
  item,
  legendPosition = "right",
}: {
  item: { [key: string]: number };
  legendPosition?: "bottom" | "right";
}) {
  const config = Object.keys(item).map((key) => [
    key,
    {
      label: key,
      //   color: SECONDARY_COLORS[idx % SECONDARY_COLORS.length],
    } satisfies ChartConfig[0],
  ]);
  const data = Object.entries(item).map(([key, value], idx) => ({
    label: key,
    value: Number((value * 100).toFixed(2)),
    fill: SECONDARY_COLORS[idx % SECONDARY_COLORS.length],
  }));

  return (
    <ChartContainer
      config={Object.fromEntries(config)}
      className="mx-auto aspect-square max-h-[210px] w-full pb-0 [&_.recharts-pie-label-text]:fill-foreground"
    >
      <RePieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey="value"
          label
          nameKey="label"
          endAngle={90}
          startAngle={450}
          innerRadius={40}
          outerRadius={60}
        />
        {legendPosition === "right" ? (
          <Legend verticalAlign="middle" align="right" layout="vertical" />
        ) : (
          <Legend />
        )}
      </RePieChart>
    </ChartContainer>
  );
}
