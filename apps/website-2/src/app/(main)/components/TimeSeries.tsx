"use client";

import { usePages } from "@/hooks/feature/use-pages";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  RechartArea,
} from "ui/components/";

export default function TimeSeries() {
  const { data } = usePages();

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Engagements</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <RechartArea
            data={data?.timeSeries.page_post_engagements ?? []}
            dataKey="value"
            label="Daily Engagements"
            labelKey="end_time"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Followers</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <RechartArea
            data={data?.timeSeries.page_daily_follows ?? []}
            dataKey="value"
            label="Daily Followers"
            labelKey="end_time"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Impressions</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <RechartArea
            data={data?.timeSeries.page_impressions ?? []}
            dataKey="value"
            label="Daily Impressions"
            labelKey="end_time"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Likes</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <RechartArea
            data={data?.timeSeries.page_fan_adds ?? []}
            dataKey="value"
            label="Daily Likes"
            labelKey="end_time"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Video Views</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <RechartArea
            data={data?.timeSeries.page_video_views ?? []}
            dataKey="value"
            label="Daily Video Views"
            labelKey="end_time"
          />
        </CardContent>
      </Card>
    </div>
  );
}
