"use client";
import { usePages } from "@/hooks/feature/use-pages";
import {
  ChartNoAxesCombined,
  Heart,
  MousePointerClick,
  SquarePlay,
  Star,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "ui/components/";

export default function Metrics() {
  const { data } = usePages();
  return (
    <div>
      {data && (
        <div className="grid grid-cols-10 gap-3">
          <MetricCard
            data={{
              icon: ChartNoAxesCombined,
              name: "Total Impressions",
              value: data.metrics.page_impressions,
              description: "",
            }}
          />
          <MetricCard
            data={{
              icon: MousePointerClick,
              name: "Total Engagements",
              value: data.metrics.page_post_engagements,
              description: "",
            }}
          />
          <MetricCard
            data={{
              icon: SquarePlay,
              name: "Total Page Video Views",
              value: data.metrics.page_video_views,
              description: "",
            }}
          />
          <MetricCard
            data={{
              icon: Heart,
              name: "Total Likes",
              value: data.metrics.page_fans,
              description: "",
            }}
          />
          <MetricCard
            data={{
              icon: Star,
              name: "Total Followers",
              value: data.metrics.page_follows,
              description: "",
            }}
          />
        </div>
      )}
    </div>
  );
}

type MetricCardProps = {
  name: string;
  description: string;
  icon: LucideIcon;
  value: number;
};

const MetricCard = ({ data }: { data: MetricCardProps }) => (
  <Card className="col-span-2">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{data.name}</CardTitle>
      <data.icon className="size-4" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{data.value}</div>
      <p className="text-xs text-muted-foreground">{data.description}</p>
    </CardContent>
  </Card>
);
