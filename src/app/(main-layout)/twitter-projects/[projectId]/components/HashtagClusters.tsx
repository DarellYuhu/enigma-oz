"use client";

import useTwitterHashtageClusterInfo, {
  ClusterInfo,
} from "@/hooks/features/twitter/useTwitterHashtagClusterInfo";
import useClusterStore from "../store/cluster-store";
import * as Tabs from "@radix-ui/react-tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import useTwitterHashtagNet2 from "@/hooks/features/twitter/useTwitterHashtagNet2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import abbreviateNumber from "@/utils/abbreviateNumber";
import { Separator } from "@/components/ui/separator";
import {
  DiscreteLegend,
  DiscreteLegendEntry,
  LinearGauge,
  LinearGaugeSeries,
} from "reaviz";
import chroma from "chroma-js";
import { Frown, Meh, Smile } from "lucide-react";
import ReactMarkdown from "react-markdown";
import HorizontalBarChart from "@/components/charts/HorizontalBarChart";
import Datatable from "@/components/datatable/Datatable";
import { ColumnDef } from "@tanstack/react-table";
import useHashtagStore from "../store/hashtag-config-store";
import dateFormatter from "@/utils/dateFormatter";
import { Skeleton } from "@/components/ui/skeleton";

const colorScheme = chroma.scale(["#f87171", "#4ade80"]).colors(3);
const scale = [
  {
    type: "Negative",
    icon: <Frown />,
  },
  {
    type: "Neutral",
    icon: <Meh />,
  },
  {
    type: "Positive",
    icon: <Smile />,
  },
];

const HashtagClusters = ({ projectId }: { projectId: string }) => {
  const { date: graphDate, window } = useHashtagStore();
  const { hashtag, setHashtag } = useClusterStore();
  const graph = useTwitterHashtagNet2({
    projectId,
    date: graphDate && dateFormatter("ISO", graphDate),
    window,
  });
  const clusterInfo = useTwitterHashtageClusterInfo({
    projectId,
    date: graph.data?.data.date,
    window,
    cluster: hashtag,
  });

  if (graph.isPending || clusterInfo.isPending)
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-3">
          <Skeleton className="h-8 w-full col-span-4" />
          <Skeleton className="h-8 w-full col-span-4" />
          <Skeleton className="h-8 w-full col-span-4" />
        </div>
        <div className="grid grid-cols-12 gap-3">
          <div className="grid grid-cols-12 gap-3 col-span-8">
            <Skeleton className="h-32 w-full col-span-6" />
            <Skeleton className="h-32 w-full col-span-6" />
            <Skeleton className="h-80 w-full col-span-full" />
          </div>
          <Skeleton className="h-full w-full col-span-4" />
        </div>
      </div>
    );

  return (
    <Tabs.Root className="space-y-4" value={hashtag} onValueChange={setHashtag}>
      <ScrollArea className="w-full overflow-x-auto ">
        <Tabs.TabsList className="flex flex-row w-full bg-gray-300 rounded-md p-2 gap-2">
          {graph.data?.normalized.classes
            .filter((item) => !!item.representation)
            .map((item, index) => (
              <Tabs.TabsTrigger
                key={index}
                value={item.id}
                className={
                  "p-2 w-10 h-10w-10 rounded-md data-[state=active]:opacity-35 data-[state=active]:shadow-md transition-all duration-300"
                }
                style={{
                  backgroundColor: item.color,
                }}
              />
            ))}
        </Tabs.TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {graph.data?.normalized.classes.map((item, index) => (
        <Tabs.TabsContent
          key={index}
          value={item.id}
          className="w-full grid grid-cols-12 gap-4"
        >
          <div className="grid grid-cols-12 gap-4 col-span-full lg:col-span-8">
            <Card className="col-span-6">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-row justify-evenly">
                  <div className="flex flex-col items-center">
                    {abbreviateNumber(item.total_views)}
                    <p className="text-sm">Views</p>
                  </div>
                  <Separator orientation="vertical" className="h-11" />
                  <div className="flex flex-col items-center">
                    {abbreviateNumber(item.total_favorites)}
                    <p className="text-sm">Likes</p>
                  </div>
                  <Separator orientation="vertical" className="h-11" />
                  <div className="flex flex-col items-center">
                    {abbreviateNumber(item.total_retweets)}
                    <p className="text-sm">Retweets</p>
                  </div>
                  <Separator orientation="vertical" className="h-11" />
                  <div className="flex flex-col items-center">
                    {abbreviateNumber(item.total_replies)}
                    <p className="text-sm">Replies</p>
                  </div>
                </div>
                <Separator orientation="horizontal" className="" />
                <div className="flex flex-row justify-evenly">
                  <div className="flex flex-col items-center">
                    {abbreviateNumber(item.num_contents)}
                    <p className="text-sm">Tweets</p>
                  </div>
                  <Separator orientation="vertical" className="h-11" />
                  <div className="flex flex-col items-center">
                    {abbreviateNumber(item.num_authors)}
                    <p className="text-sm">Accounts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-6">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Tone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="col-span-full">
                  <LinearGauge
                    series={<LinearGaugeSeries colorScheme={colorScheme} />}
                    data={[
                      { key: "Negative", data: item.tone_negative * 100 },
                      { key: "Neutral", data: item.tone_neutral * 100 },
                      { key: "Positive", data: item.tone_positive * 100 },
                    ]}
                    height={30}
                    className="w-full"
                  />
                  <DiscreteLegend
                    orientation="horizontal"
                    entries={scale.map((v, i) => (
                      <DiscreteLegendEntry
                        key={index}
                        style={{
                          padding: "0 3px",
                        }}
                        symbol={v.icon}
                        label={`${v.type}`}
                        color={colorScheme[i]}
                        orientation="horizontal"
                      />
                    ))}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-6 lg:col-span-4">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Representation</CardTitle>
                <CardDescription>{item.representation}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="col-span-6 lg:col-span-8">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Summary</CardTitle>
                <CardDescription>{item.summary}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="col-span-full">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Topics</CardTitle>
                <CardDescription>
                  <ReactMarkdown>{item.topics}</ReactMarkdown>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="col-span-full lg:col-span-4 grid grid-cols-12 gap-4">
            <Card className="col-span-full">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Top Viewed Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <Datatable
                    columns={columns}
                    data={clusterInfo.data?.data.authors || []}
                    initialPageSize={10}
                    pagination={false}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
            <div className="col-span-full h-96">
              <HorizontalBarChart
                data={clusterInfo.data?.normalized || []}
                dataKey="value"
                labelKey="hashtag"
                label="Value"
                hidelabel={false}
              />
            </div>
          </div>
        </Tabs.TabsContent>
      ))}
    </Tabs.Root>
  );
};

const columns: ColumnDef<ClusterInfo["authors"][0]>[] = [
  {
    accessorKey: "user_screen_name",
    header: "Author",
  },
  {
    accessorKey: "view_count",
    header: "Views",
    cell(props) {
      return abbreviateNumber(props.row.original.view_count);
    },
  },
];

export default HashtagClusters;
