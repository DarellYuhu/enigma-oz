"use client";

import RechartDoughnut from "@/components/charts/RechartDoughnut";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useFacebookStatistics from "@/hooks/features/facebook/useFacebookStatistics";

export default function TopDomain() {
  const { data } = useFacebookStatistics();

  return (
    <div>
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Top Domain</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <RechartDoughnut
              config={Object.fromEntries(
                data.top_domains.map((item) => [
                  item.name,
                  { color: item.fill, label: item.name },
                ])
              )}
              data={data.top_domains.slice(0, 10)}
              dataKey="value"
              labelKey="name"
              innerRadius={70}
              outerRadius={100}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
