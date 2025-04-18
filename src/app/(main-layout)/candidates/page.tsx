import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CandidateSelection } from "./components/candidate-selection";
import metric from "@/data/candidate_metric.json";
import { PieChart } from "./components/pie-chart";
import { Maps } from "./components/maps";
import { TrustMap } from "./components/trust-map";
import { BarChart } from "./components/bar-chart";

export default function CandidatesPage({
  searchParams,
}: {
  searchParams: {
    key?: keyof typeof metric.data;
  };
}) {
  const { key } = searchParams;
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-full">
        <CandidateSelection />
      </div>

      {key && (
        <>
          <Card className="relative col-span-6">
            <CardHeader>
              <CardTitle>Voters Preferences by Region</CardTitle>
            </CardHeader>
            <CardContent className="h-[450px] w-full">
              <Maps item={metric.data[key].Region} />
            </CardContent>
          </Card>

          <Card className="relative col-span-6">
            <CardHeader>
              <CardTitle>Trust Ratings by Region</CardTitle>
            </CardHeader>
            <CardContent className="h-[450px] w-full">
              <TrustMap candidateKey={key} />
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Locale</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart item={metric.data[key]["Locale"]} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Gender</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                item={metric.data[key].Gender}
                legendPosition="bottom"
              />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Generation</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <BarChart item={metric.data[key]["Generation"]} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Generation by Segment</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <BarChart
                item={metric.data[key]["Generation_Segment"]}
                withDomain={true}
              />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Political Alignment</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <BarChart item={metric.data[key]["Political Alignment"]} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Political Alignment by Segment</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <BarChart
                item={metric.data[key]["Political Alignment_Segment"]}
                withDomain={true}
              />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Social Status</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <BarChart item={metric.data[key]["Social Status"]} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Social Status by Segment</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <BarChart
                item={metric.data[key]["Social Status_Segment"]}
                withDomain={true}
              />
            </CardContent>
          </Card>
          <Card className="col-span-6">
            <CardHeader>
              <CardTitle>Religious Affiliation</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                item={metric.data[key]["Religious Affiliation"]}
                legendPosition="bottom"
              />
            </CardContent>
          </Card>
          <Card className="col-span-6">
            <CardHeader>
              <CardTitle>Ethnicity</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart item={metric.data[key].Ethnicity} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
