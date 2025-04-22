import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Region } from "./components/region";
import { Metric } from "./components/metric";

export default function PoliticalBase() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Political Preferences by Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <Region />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Political Preferences Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-12 gap-3">
          <Metric />
        </CardContent>
      </Card>
    </div>
  );
}
