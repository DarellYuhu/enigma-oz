"use client";

import RechartHorizontal from "@/components/charts/RechartHorizontal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useFacebookStatistics from "@/hooks/features/facebook/useFacebookStatistics";

export default function Metrics() {
  const { data } = useFacebookStatistics();
  return (
    <div>
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Reactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RechartHorizontal
              data={Object.entries(data.reactions).map(([key, value]) => ({
                key,
                value,
              }))}
              dataKey="value"
              labelKey="key"
              label="Reaction"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
