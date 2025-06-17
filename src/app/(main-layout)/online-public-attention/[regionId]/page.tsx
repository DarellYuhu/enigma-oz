import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Configuration from "../components/Configuration";
import Rank from "../components/Rank";
import PH_JSON from "@/data/geojson/ph.json";
import TimeSeries from "../components/TimeSeries";
import ActorNetwork from "../components/ActorNetwork";
import { ScrollArea } from "@/components/ui/scroll-area";
import TopCentrality from "../components/TopCentrality";
import NetworkConfig from "../components/NetworkConfig";
import Statistics from "../components/Statistics";

const RegionPage = ({ params }: { params: { regionId: string } }) => {
  return (
    <div className="grid grid-cols-12 gap-3">
      <CardTitle className="col-span-full">
        {PH_JSON.features.find((f) => f.properties.regcode === params.regionId)
          ?.properties.regname ?? "Unkown Region"}
      </CardTitle>
      <div className="col-span-full">
        <Configuration details={params.regionId} />
      </div>

      <div className="col-span-full">
        <TimeSeries details={params.regionId} />
      </div>

      <div className="col-span-full">
        <Rank details={params.regionId} />
      </div>

      <Card className="col-span-full">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Corelation Network</CardTitle>
          <NetworkConfig />
        </CardHeader>
        <CardContent className="grid grid-cols-12 gap-3">
          <Card className="col-span-full relative">
            <CardHeader>
              <CardTitle>Metrics</CardTitle>
            </CardHeader>
            <CardContent className="h-52">
              <Statistics details={params.regionId} />
            </CardContent>
          </Card>

          <div className="col-span-8">
            <ActorNetwork details={params.regionId} />
          </div>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Betweeness Centrality</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <TopCentrality details={params.regionId} />
              </ScrollArea>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegionPage;
