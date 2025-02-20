import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Board from "./components/Board";
import HashtagNetGraph from "./components/HashtagNetGraph";
import HashtagEvoSankey from "./components/HashtagEvoSankey";
import BoardConfig from "./components/BoardConfig";
import TimeSeries from "./components/TimeSeries";
import ClusterStatistics from "./components/ClusterStatistics";
import HashtagClusters from "./components/HashtagClusters";
import AccountNetGraph from "./components/AccountNetGraph";
import AccountCluster from "./components/AccountCluster";
import TopCentralityAccount from "./components/TopCentralityAccount";
import HashtagConfig from "./components/HashtagConfig";
import AccountConfig from "./components/AccountConfig";

const TwitterProjectDetail = ({
  params,
}: {
  params: { projectId: string };
}) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-full relative">
        <CardHeader>
          <CardTitle>Time Series</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeSeries projectId={params.projectId} />
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Board</CardTitle>
          <BoardConfig projectId={params.projectId} />
        </CardHeader>
        <CardContent>
          <Board projectId={params.projectId} />
        </CardContent>
      </Card>

      <div className="col-span-full p-4 rounded-lg shadow-sm space-y-4 border">
        <HashtagConfig />

        <Card>
          <CardHeader>
            <CardTitle>Hashtag Evolution</CardTitle>
          </CardHeader>
          <CardContent>
            <HashtagEvoSankey projectId={params.projectId} />
          </CardContent>
        </Card>

        <Card className=" relative">
          <CardHeader>
            <CardTitle>Hashtag Network</CardTitle>
          </CardHeader>
          <CardContent>
            <HashtagNetGraph projectId={params.projectId} />
          </CardContent>
        </Card>

        <div>
          <HashtagClusters projectId={params.projectId} />
        </div>
      </div>

      <Card className="col-span-full relative">
        <CardHeader>
          <CardTitle>Account Cluster Statistics</CardTitle>
        </CardHeader>
        <CardContent className="flex">
          <div className="w-full h-80 overflow-hidden">
            <ClusterStatistics projectId={params.projectId} />
          </div>
        </CardContent>
      </Card>

      <div className="col-span-full">
        <AccountConfig />
      </div>

      <Card className="col-span-8 relative">
        <CardHeader>
          <CardTitle>Actor Network</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountNetGraph projectId={params.projectId} />
        </CardContent>
      </Card>

      <Card className="col-span-4 relative">
        <CardHeader>
          <CardTitle>Top Central Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <TopCentralityAccount projectId={params.projectId} />
        </CardContent>
      </Card>

      <div className="col-span-full">
        <AccountCluster projectId={params.projectId} />
      </div>
    </div>
  );
};

export default TwitterProjectDetail;
