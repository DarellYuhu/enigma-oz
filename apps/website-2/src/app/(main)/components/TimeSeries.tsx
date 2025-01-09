"use client";

import { usePages } from "@/hooks/feature/use-pages";
import {
  Card,
  CardContent,
  CardDescription,
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
          <CardDescription>
            The number of times people have engaged with your posts through
            like, comments and shares and more.
          </CardDescription>
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
          <CardTitle>New Follows</CardTitle>
          <CardDescription>
            The number of times your Facebook Pages or profiles was followed in
            the selected time period
          </CardDescription>
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
          <CardDescription>
            The number of times any content from your Page or about your Pages
            entered a person&apos;s screen.
          </CardDescription>
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
          <CardDescription>
            The number of new people who have liked your Pages.
          </CardDescription>
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
          <CardDescription>
            Total number of times videos have been viewed for more than 3
            seconds.
          </CardDescription>
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
