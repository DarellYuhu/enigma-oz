import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GenderList } from "./components/gender-list";
import { GenerationList } from "./components/generation-list";
import { RegionRank } from "./components/region-rank";

export default function RankingPage() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>By Region</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 ">
          <div className="h-96">
            <RegionRank />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>By Gender</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <GenderList />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>By Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <GenerationList />
        </CardContent>
      </Card>
    </div>
  );
}
