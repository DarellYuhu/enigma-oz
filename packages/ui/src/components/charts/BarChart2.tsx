import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import abbreviateNumber from "@/utils/abbreviateNumber";

type Props<T = unknown> = {
  data: { [key: string]: T }[];
  label: string;
  labelKey: string;
  dataKey: string;
  topLabel?: boolean;
  grid?: boolean;
  brush?: boolean;
  fill?: string;
  yAxis?: boolean;
  xAxis?: boolean;
};

const BarChart2 = ({
  data,
  dataKey,
  labelKey,
  label,
  topLabel = true,
  grid = false,
  brush = false,
  fill = "#3b82f6",
  yAxis = true,
  xAxis = false,
}: Props) => {
  return (
    <ResponsiveContainer>
      <ChartContainer
        config={{
          [dataKey]: {
            color: "#3b82f6",
            label: label,
          },
        }}
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            top: 20,
          }}
        >
          {grid && <CartesianGrid vertical={false} />}
          <XAxis
            dataKey={labelKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            hide={!xAxis}
          />
          {yAxis && (
            <YAxis
              dataKey={dataKey}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => abbreviateNumber(value)}
            />
          )}
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                labelFormatter={(value, payload) => {
                  return new Date(
                    payload[0].payload[labelKey]
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
              />
            }
          />
          {brush && <Brush dataKey={labelKey} height={20} />}
          <Bar dataKey={dataKey} fill={fill} radius={8}>
            {topLabel && (
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            )}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};

export default BarChart2;
