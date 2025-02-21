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
import VisGraph from "@/components/VisGraph";
import { GLASBEY_COLORS } from "@/constants";
import networkData from "@/data/youtube_map_ph.json";
import abbreviateNumber from "@/utils/abbreviateNumber";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DataSet } from "vis-data";

export default function YoutubeMapPage() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [withEdges, _setWithEdges] = useState(true);
  const [sizeType, setSizeType] = useState<
    "subscriber_count" | "view_count" | "centrality_pr"
  >("centrality_pr");
  const data = useMemo(() => {
    const max = Math.max(
      ...networkData.network.nodes.map((node) => node[sizeType])
    );

    return {
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
            : "",
        size: Math.sqrt(1 - Math.pow(node[sizeType] / max - 1, 2)) * 15,
        shape: "dot",
        label: node.channel_name,
        font: {
          size: Math.sqrt(1 - Math.pow(node[sizeType] / max - 1, 2)) * 17,
        },
        fixed: true,
      })),
    };
  }, [networkData, sizeType]);

  return (
    <div>
      <Card>
        <CardHeader className="relative">
          <CardTitle>Map</CardTitle>
          <Select
            value={sizeType}
            onValueChange={(val) => setSizeType(val as typeof sizeType)}
          >
            <SelectTrigger className="absolute top-2 right-2 w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="centrality_pr">Page Rank</SelectItem>
              <SelectItem value="view_count">View Count</SelectItem>
              <SelectItem value="subscriber_count">Subscriber Count</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="h-[500px] relative">
          {data && (
            <VisGraph
              events={{
                click: (event) => {
                  const nodes = new DataSet(data.nodes);
                  const node = nodes.get(event.nodes[0]);
                  if (node && !Array.isArray(node)) {
                    setSelectedNode(node);
                  } else {
                    setSelectedNode(null);
                  }
                },
              }}
              data={data}
              options={{
                physics: false,
                interaction: {
                  hideEdgesOnDrag: true,
                },
              }}
            />
          )}

          {selectedNode && <NodeInfo node={selectedNode} />}
        </CardContent>
      </Card>
    </div>
  );
}

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
