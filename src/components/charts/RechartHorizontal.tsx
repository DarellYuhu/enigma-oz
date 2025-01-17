import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { format, isDate } from "date-fns";

type Props = {
  data: any[];
  dataKey: string;
  labelKey: string;
  label: string;
};

export default function RechartHorizontal(props: Props) {
  return (
    <ChartContainer
      config={{
        [props.dataKey]: {
          label: props.label,
          color: "hsl(var(--chart-1))",
        },
      }}
    >
      <BarChart
        accessibilityLayer
        data={props.data}
        layout="vertical"
        margin={{
          left: -10,
        }}
      >
        <XAxis type="number" dataKey={props.dataKey} hide />
        <YAxis
          dataKey={props.labelKey}
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            isDate(value) ? format(new Date(value), "yyyy-MM-dd") : value
          }
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey={props.dataKey} fill="hsl(var(--chart-1))" radius={5} />
      </BarChart>
    </ChartContainer>
  );
}
