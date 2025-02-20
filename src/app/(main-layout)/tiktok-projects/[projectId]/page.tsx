import StatisticsFilter from "./components/StatisticsFilter";
import Category from "./components/Category";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Weekly from "./components/Weekly";
import Monthly from "./components/Monthly";
import Creators from "./components/Creators";
import Daily from "./components/Daily";
import HashtagGraph from "./components/HashtagGraph";
import InterestGraph from "./components/InterestGraph";
import TopCentrality from "./components/TopCentrality";
import ClusterInfo from "./components/ClusterInfo";
import Board from "./components/Board";
import TypeSelection from "./components/TypeSelection";
import GraphFilter from "./components/GraphFilter";

const ProjectDetail = ({ params }: { params: { projectId: string } }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-3 p-4 border rounded-md shadow-sm">
        <div className="col-span-full">
          <StatisticsFilter projectId={params.projectId} />
        </div>

        <div className="col-span-full md:col-span-6 flex">
          <Category projectId={params.projectId} />
        </div>

        <Card className="col-span-6 md:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Weekly</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <Weekly projectId={params.projectId} />
          </CardContent>
        </Card>

        <Card className="col-span-6 md:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Monthly</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <Monthly projectId={params.projectId} />
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-5">
          <CardHeader>
            <CardTitle>Top Creators</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-80">
            <Creators projectId={params.projectId} />
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-7 flex flex-col">
          <CardHeader>
            <CardTitle>Daily</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 pt-0 pl-0 pr-4 h-80">
            <Daily projectId={params.projectId} />
          </CardContent>
        </Card>

        <Card className="col-span-full flex flex-col">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Content Board</CardTitle>
            <TypeSelection />
          </CardHeader>
          <CardContent>
            <Board projectId={params.projectId} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 p-4 border rounded-md shadow-sm">
        <div className="">
          <GraphFilter />
        </div>

        <Card className=" flex flex-col">
          <CardHeader>
            <CardTitle>Hashtag Map</CardTitle>
          </CardHeader>
          <CardContent className="relative p-0 h-80">
            <HashtagGraph projectId={params.projectId} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-12 gap-4">
          <Card className="col-span-8 flex flex-col">
            <CardHeader>
              <CardTitle>Interest Network</CardTitle>
            </CardHeader>
            <CardContent className="relative p-0 h-80">
              <InterestGraph projectId={params.projectId} />
            </CardContent>
          </Card>

          <Card className="col-span-4 relative">
            <CardHeader>
              <CardTitle>Top Centrality Contents</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TopCentrality projectId={params.projectId} />
            </CardContent>
          </Card>
        </div>

        <div className="">
          <ClusterInfo projectId={params.projectId} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
