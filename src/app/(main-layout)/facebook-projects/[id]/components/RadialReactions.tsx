import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { COLORS } from "@/constants";
import useFacebookTopics from "@/hooks/features/facebook/useFacebookTopics";
import { useMemo } from "react";
import {
  Label,
  Legend,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

export default function RadialReactions({ classId }: { classId: number }) {
  const { data } = useFacebookTopics();

  const chartData = useMemo(() => {
    if (data) {
      return data.classes[classId];
    }
  }, [data?.classes, classId]);

  return (
    <ChartContainer config={config} className="mx-auto aspect-square w-full ">
      <RadialBarChart
        data={[{ ...chartData }]}
        endAngle={180}
        innerRadius={80}
        outerRadius={130}
      >
        <Legend />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {Object.keys(config).reduce(
                        (acc, key) =>
                          acc +
                            (chartData?.[
                              key as keyof typeof chartData
                            ] as number) || 0,
                        0
                      )}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground"
                    >
                      Total Reactions
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        {Object.keys(config).map((key) => (
          <RadialBar
            key={key}
            dataKey={key}
            stackId={"a"}
            cornerRadius={5}
            fill={config[key as keyof typeof config].color}
            className="stroke-transparent stroke-2"
          />
        ))}
      </RadialBarChart>
    </ChartContainer>
  );
}

const config = {
  total_angry: {
    label: "Angry",
    color: COLORS[2],
  },
  total_sad: {
    label: "Sad",
    color: COLORS[1],
  },
  total_wow: {
    label: "Wow",
    color: COLORS[0],
  },
  total_haha: {
    label: "Haha",
    color: COLORS[3],
  },
} satisfies ChartConfig;
