"use client";

import HorizontalBarChart from "@/components/charts/HorizontalBarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useFacebookStatistics from "@/hooks/features/facebook/useFacebookStatistics";

export default function TopDomain() {
  const { data } = useFacebookStatistics();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Domain</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        {data && (
          <HorizontalBarChart
            data={data.top_domains}
            dataKey="value"
            labelKey="name"
            label="Domain"
          />
        )}
      </CardContent>
    </Card>
  );
}
