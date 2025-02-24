"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GLASBEY_COLORS } from "@/constants";
import networkData from "@/data/youtube_map_ph.json";
import abbreviateNumber from "@/utils/abbreviateNumber";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { DataSet } from "vis-data";
import Graph from "react-graph-vis";
import { v4 as uuid } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Datatable from "@/components/datatable/Datatable";
import { ColumnDef } from "@tanstack/react-table";
import { badgeVariants } from "@/components/ui/badge";
import HorizontalBarChart from "@/components/charts/HorizontalBarChart";

export default function YoutubeMapPage() {
  const [selectedNode, setSelectedNode] = useState(null);
  const graphRef = useRef<Graph | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [withEdges, _setWithEdges] = useState(true);
  const [sizeType, setSizeType] = useState<
    "subscriber_count" | "view_count" | "centrality_pr" | "centrality_bw"
  >("centrality_pr");
  const containerId = useMemo(() => uuid(), [sizeType, selectedClass]);

  const data = useMemo(() => {
    const max = Math.max(
      ...networkData.network.nodes.map((node) => node[sizeType])
    );

    const setOpacity = (classId: string) => {
      if (selectedClass !== null) {
        if (selectedClass === classId) {
          return 1;
        } else {
          return 0.1;
        }
      }
      return 1;
    };

    return {
      classes: networkData.class,
      network: {
        edges: withEdges
          ? networkData.network.edges.map((edge) => ({
              ...edge,
              smooth: {
                enabled: true,
                type: "curvedCCW",
                roundness: 0.5,
              },
              color: {
                color: "#97c2fc",
                opacity: 0.1,
                inherit: false,
              },
            }))
          : undefined,
        nodes: networkData.network.nodes.map((node) => ({
          ...node,
          color:
            node.class < 20
              ? GLASBEY_COLORS[node.class % GLASBEY_COLORS.length]
              : "#b0b6bc",
          size: Math.sqrt(1 - Math.pow(node[sizeType] / max - 1, 2)) * 15,
          shape: "dot",
          label: node.channel_name,
          font: {
            size: Math.sqrt(1 - Math.pow(node[sizeType] / max - 1, 2)) * 17,
          },
          fixed: true,
          opacity: setOpacity(node.class.toString()),
        })),
      },
    };
  }, [networkData, sizeType, selectedClass]);

  const handleClusterClick = (keys: string) => {
    if (keys) {
      setSelectedClass(keys);
    } else setSelectedClass(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="relative">
          <CardTitle>Youtube Map</CardTitle>
          <Select
            value={sizeType}
            onValueChange={(val) => setSizeType(val as typeof sizeType)}
          >
            <SelectTrigger className="absolute top-2 right-2 w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="centrality_pr">Page Rank</SelectItem>
              <SelectItem value="centrality_bw">
                Betweenness Centrality
              </SelectItem>
              <SelectItem value="view_count">View Count</SelectItem>
              <SelectItem value="subscriber_count">Subscriber Count</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="h-[500px] relative">
          {data && (
            <Graph
              ref={graphRef}
              key={containerId}
              graph={data.network}
              options={{
                physics: false,
                edges: {
                  arrows: {
                    to: { enabled: false },
                    from: { enabled: false },
                  },
                },
                interaction: {
                  hideEdgesOnDrag: true,
                  hideEdgesOnZoom: true,
                },
              }}
              events={{
                click: (event) => {
                  const nodes = new DataSet(data.network.nodes);
                  const node = nodes.get(event.nodes[0]);
                  if (node && !Array.isArray(node)) {
                    setSelectedNode(node);
                  } else {
                    setSelectedNode(null);
                    setSelectedClass(null);
                  }
                },
              }}
            />
          )}
          {selectedNode && <NodeInfo node={selectedNode} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cluster Info</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="0" className="items-center space-y-4">
            <TabsList className="gap-2 bg-transparent flex flex-wrap h-full w-full">
              {Object.entries(data.classes).map(([key, value]) => (
                <TabsTrigger
                  value={key}
                  key={key}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
                  onClick={() => {
                    handleClusterClick(key);
                  }}
                >
                  {value.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(data.classes).map(([key, value]) => {
              const topChannels = value.top_channels
                .map((channel) =>
                  data.network.nodes.find((node) => node.id === channel)
                )
                .filter((node) => node !== undefined);
              const categories = value.categories.categories
                .map((cat, idx) => ({
                  label: cat,
                  value: value.categories.value[idx],
                }))
                .slice(0, 10);
              return (
                <TabsContent
                  value={key}
                  className="grid grid-cols-12 mt-0 gap-4"
                  key={key}
                >
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-evenly gap-4">
                      <div className="flex flex-col items-center">
                        <div>{abbreviateNumber(value.subscriber_count)}</div>
                        <p>Subscribers</p>
                      </div>
                      <Separator orientation="horizontal" />
                      <div className="flex flex-col items-center">
                        <div>{abbreviateNumber(value.view_count)}</div>
                        <p>Views</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="col-span-8">
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-40">
                        {value.description}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  <Card className="col-span-6">
                    <CardHeader>
                      <CardTitle>Top Channels</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-80">
                        <Datatable
                          columns={columns}
                          data={topChannels}
                          initialPageSize={10}
                        />
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  <Card className="col-span-6">
                    <CardHeader>
                      <CardTitle>Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 w-full">
                        <HorizontalBarChart
                          data={categories}
                          dataKey="value"
                          label="Label"
                          labelKey="label"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

const columns: ColumnDef<(typeof networkData)["network"]["nodes"][0]>[] = [
  {
    accessorKey: "channel_name",
    header: "Channel Name",
    cell({ row }) {
      return (
        <Link
          className={badgeVariants({ variant: "default" })}
          href={"https://youtube.com/channel/" + row.original.id}
          target={"_blank"}
        >
          {row.original.channel_name}
        </Link>
      );
    },
  },
  {
    accessorKey: "subscriber_count",
    header: "Subscribers",
    cell: ({ row }) => abbreviateNumber(row.original.subscriber_count),
  },
  {
    accessorKey: "view_count",
    header: "Views",
    cell: ({ row }) => abbreviateNumber(row.original.view_count),
  },
  {
    accessorKey: "video_count",
    header: "Videos",
    cell: ({ row }) => abbreviateNumber(row.original.video_count),
  },
];

const NodeInfo = ({ node }: { node: any }) => {
  return (
    <Card className="absolute top-0 left-5">
      <CardHeader>
        <CardTitle>{node.channel_name}</CardTitle>
        <CardDescription>
          <div>Views: {abbreviateNumber(node.view_count * 100)}</div>
          <div>Subscribers: {abbreviateNumber(node.subscriber_count)}</div>
          <Link
            href={"https://youtube.com/channel/" + node.id}
            target={"_blank"}
            className={`${buttonVariants({
              variant: "outline",
            })} bg-red-500 text-white hover:bg-red-500 hover:text-white mt-4`}
          >
            Visit Channel
          </Link>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
