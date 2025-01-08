import { Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

type Props<T = unknown> = {
  data: { [key: string]: T }[];
  dataKey: string;
  label: string;
  labelKey: string;
};

const AreaChart2 = ({ data, dataKey, label, labelKey }: Props) => {
  return (
    <ChartContainer
      config={
        {
          [labelKey]: {
            label: label,
            color: "#277F73",
          },
        } satisfies ChartConfig
      }
    >
      <AreaChart accessibilityLayer data={data}>
        <XAxis dataKey={labelKey} hide={true} />
        <YAxis
          dataKey={dataKey}
          hide={true}
          allowDataOverflow={true}
          domain={(props) => {
            return [0, props[1] * 1.2];
          }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey={dataKey}
          type="natural"
          fill="#4ade80"
          fillOpacity={0.4}
          stroke="#4ade80"
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default AreaChart2;
