import { Legend, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import abbreviateNumber from "@/utils/abbreviateNumber";

type Props = {
  data: any[];
  config: ChartConfig;
  dataKey: string;
  labelKey: string;
};

export default function RechartPie(props: Props) {
  return (
    <ChartContainer
      config={props.config}
      className="mx-auto aspect-square px-0 h-full"
    >
      <PieChart>
        <ChartTooltip
          content={<ChartTooltipContent nameKey={props.labelKey} hideLabel />}
        />
        <Legend />
        <Pie
          startAngle={360 + 90}
          endAngle={90}
          data={props.data}
          dataKey={props.dataKey}
          label={({ payload, ...labelProps }) => {
            return (
              <text
                cx={labelProps.cx}
                cy={labelProps.cy}
                x={labelProps.x}
                y={labelProps.y}
                textAnchor={labelProps.textAnchor}
                dominantBaseline={labelProps.dominantBaseline}
                fill="hsla(var(--foreground))"
              >
                {abbreviateNumber(payload[props.dataKey])}
              </text>
            );
          }}
          //   label
        />
      </PieChart>
    </ChartContainer>
  );
}
