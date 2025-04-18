"use client ";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

type Props = {
  label: string;
  hidelabel?: boolean;
  labelKey: string;
  dataKey: string;
  data: { [key: string]: any }[];
  selectedId?: string;
  onBarSelect?: (item: YoutubeTopChannels["tc"]["0"]) => void;
  withDomain?: boolean;
};

const HorizontalBarChart = ({
  hidelabel = true,
  label,
  labelKey,
  dataKey,
  data,
  selectedId,
  withDomain,
  onBarSelect,
}: Props) => {
  return (
    <ChartContainer
      className="h-full w-full"
      config={{
        [labelKey]: {
          label: label,
          color: "hsl(var(--chart-1))",
        },
      }}
    >
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          right: 16,
        }}
      >
        <CartesianGrid horizontal={false} />
        {withDomain ? (
          <XAxis type="number" dataKey={dataKey} hide domain={[0, 100]} />
        ) : (
          <XAxis type="number" dataKey={dataKey} hide />
        )}
        <YAxis
          dataKey={labelKey}
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          hide
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent hideLabel={hidelabel} indicator="line" />
          }
        />
        <Bar
          dataKey={dataKey}
          radius={withDomain ? 0 : 5}
          fill={"#c4e5f3"}
          background={withDomain ? { fill: "#eee" } : undefined}
        >
          {data.map((entry, index) => (
            <Cell
              fill={
                selectedId !== entry.channel_id || withDomain
                  ? "#ffb321"
                  : "#c4e5f3"
              }
              key={`cell-${index}`}
              onClick={() =>
                onBarSelect &&
                onBarSelect(entry as YoutubeTopChannels["tc"]["0"])
              }
            />
          ))}
          <LabelList
            content={({ value, y, height }) => {
              return (
                <text
                  x={6}
                  y={(y as number) + (height as number) / 2}
                  fill="#000"
                  textAnchor="left"
                  dominantBaseline="middle"
                >
                  {value}
                </text>
              );
            }}
            dataKey={labelKey}
            position="right"
            offset={8}
            className="fill-[#000000]"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default HorizontalBarChart;
