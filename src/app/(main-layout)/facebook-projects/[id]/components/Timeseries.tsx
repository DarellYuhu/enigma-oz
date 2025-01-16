"use client";
import RechartArea from "@/components/charts/RechartArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useFacebookStatistics from "@/hooks/features/facebook/useFacebookStatistics";
import { useState } from "react";

export default function Timeseries() {
  const [type, _setType] = useState<"engagements" | "num_articles">(
    "engagements"
  );
  const { data } = useFacebookStatistics();
  return (
    <div className="space-y-3">
      {data && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardHeader>
                <CardTitle>Time Series - Daily</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <RechartArea
                  data={data.ts.daily}
                  dataKey={type}
                  label={typeMap[type]}
                  labelKey="date"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Time Series - Weekly</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <RechartArea
                  data={data.ts.weekly}
                  dataKey={type}
                  label={typeMap[type]}
                  labelKey="date"
                />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Time Series - Monthly</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <RechartArea
                data={data.ts.monthly}
                dataKey={type}
                label={typeMap[type]}
                labelKey="date"
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

const typeMap = {
  engagements: "Engagements",
  num_articles: "Number of Articles",
};
