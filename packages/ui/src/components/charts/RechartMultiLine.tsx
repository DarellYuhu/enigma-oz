import { Brush, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { format } from "date-fns";
import { CurveType } from "recharts/types/shape/Curve";
import { AxisDomain } from "recharts/types/util/types";

type Props = {
  config: { dataKey: string; labelKey: string; label: string; color: string }[];
  data: { [key: string]: string | number }[];
  type?: CurveType;
  domain?: AxisDomain;
  tickFormatter?: (value: any, index: number) => string;
};
const RechartMultiLine = ({
  config,
  data,
  domain = [0, "auto"],
  type = "monotone",
  tickFormatter = (value) =>
    value ? format(new Date(value), "yyyy-MM-dd") : "",
}: Props) => {
  return (
    <ChartContainer
      className="h-full w-full"
      config={
        config.reduce((acc: Record<string, object>, curr) => {
          acc[curr.dataKey] = { label: curr.label, color: curr.color };
          return acc;
        }, {}) satisfies ChartConfig
      }
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <Brush height={20} dataKey={config[0].labelKey} travellerWidth={8} />
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={config[0].labelKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={tickFormatter}
        />
        <YAxis domain={domain} hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        {config.map((item, index) => (
          <Line
            key={index}
            dataKey={item.dataKey}
            type={type}
            stroke={item.color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
};

export default RechartMultiLine;
