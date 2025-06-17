import Configuration from "./components/Configuration";
import TimeSeries from "./components/TimeSeries";
import Rank from "./components/Rank";
import Maps from "./components/Maps";
import ActorNetwork from "./components/ActorNetwork";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopCentrality from "./components/TopCentrality";
import { ScrollArea } from "@/components/ui/scroll-area";
import Statistics from "./components/Statistics";
import NetworkConfig from "./components/NetworkConfig";

const TrendsPage = () => {
  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-full">
        <Configuration details="PH" />
      </div>

      <div className="col-span-full">
        <TimeSeries details="PH" />
      </div>

      <div className="col-span-full">
        <Rank details="PH" />
      </div>

      <div className="col-span-full">
        <Maps details="PH" />
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
              <Statistics details="PH" />
            </CardContent>
          </Card>

          <div className="col-span-8">
            <ActorNetwork details="PH" />
          </div>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Betweeness Centrality</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <TopCentrality details="PH" />
              </ScrollArea>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsPage;
