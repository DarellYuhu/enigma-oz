import { Legend, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

type Props = {
  config: Record<string, { label: string; color: string }>;
  data: { [key: string]: number | string }[];
  dataKey: string;
  labelKey: string;
  outerRadius: number;
  innerRadius: number;
  tooltip?: boolean;
  legend?: boolean;
};
const RechartDoughnut = ({
  tooltip = true,
  legend = true,
  ...props
}: Props) => {
  return (
    <ChartContainer
      style={{ width: "100%", height: "100%" }}
      config={props.config satisfies ChartConfig}
    >
      <PieChart>
        {tooltip && (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
        )}
        <Pie
          startAngle={360 + 90}
          endAngle={90}
          startOffset={90}
          data={props.data}
          dataKey={props.dataKey}
          nameKey={props.labelKey}
          outerRadius={props.outerRadius}
          innerRadius={props.innerRadius}
        />
        {legend && (
          <Legend align="right" layout="vertical" verticalAlign="middle" />
        )}
      </PieChart>
    </ChartContainer>
  );
};

export default RechartDoughnut;
