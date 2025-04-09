"use client";

import VisGraph from "@/components/VisGraph";
import { useTiktokHashtagNet } from "@/hooks/features/tiktok/useTiktokHashtagNet";
import { useTiktokInterestNet } from "@/hooks/features/tiktok/useTiktokInterestNet";
import { subDays } from "date-fns";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataSet } from "vis-data";
import { useState } from "react";
import TagInformation from "@/components/TagInformation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Expand } from "lucide-react";
import tagRelationExport from "@/utils/tagRelationExport";
import Graph from "@/components/charts/Graph";
import Link from "next/link";
import { Toggle } from "@/components/ui/toggle";
import { interestNetExport } from "@/utils/interestNetExport";
import { Configuration } from "./components/configuration";

export default function GraphExplorerPage() {
  const searhParams = useSearchParams();
  const [label, setLabel] = useState(false);
  const [node, setNode] = useState<any>(null);
  const [tagNode, setTagNode] = useState(null);
  const params = useParams();
  const { search, from, to } = {
    search: searhParams.get("search") || "",
    from: searhParams.get("from")
      ? new Date(searhParams.get("from") as string)
      : subDays(new Date(), 3),
    to: searhParams.get("to")
      ? new Date(searhParams.get("to") as string)
      : new Date(),
  };

  const InterestNet = useTiktokInterestNet({
    graphDate: {
      from,
      to,
    },
    graphQuery: search,
    params: { projectId: params.projectId as string },
  });

  const HashtagNet = useTiktokHashtagNet({
    graphDate: {
      from,
      to,
    },
    graphQuery: search,
    params: { projectId: params.projectId as string },
  });

  if (HashtagNet.isPending)
    return (
      <div className="p-4 w-full h-full">
        <Skeleton className="w-full h-full" />
      </div>
    );

  return (
    <div className="space-y-4">
      <Configuration />
      <Card className="relative">
        <CardHeader>
          <CardTitle>Hashtag Network</CardTitle>
        </CardHeader>
        <CardContent className="h-[450px]">
          {HashtagNet.data && (
            <>
              <VisGraph
                data={HashtagNet.data.normalized ?? []}
                type="tagRelation"
                events={{
                  click: (event) => {
                    const nodes = new DataSet(
                      HashtagNet.data.data.relation.nodes
                    );
                    const node = nodes.get(event.nodes[0]);
                    if (node && !Array.isArray(node)) {
                      setTagNode(node);
                    } else {
                      setTagNode(null);
                    }
                  },
                }}
              />
              {tagNode ? (
                <div className="absolute p-2 h-4/5 w-fit backdrop-blur-md border rounded-md shadow-md bottom-0 left-0 m-2">
                  <TagInformation tagNode={tagNode} />
                </div>
              ) : null}
              <div className="absolute top-2 right-2 justify-items-center flex gap-2">
                <Dialog>
                  <DialogTrigger>
                    <Button size={"icon"} variant={"ghost"}>
                      <Expand size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="min-w-[90%] h-[90%]">
                    <VisGraph
                      data={HashtagNet.data.normalized ?? []}
                      type="tagRelation"
                      events={{
                        click: (event) => {
                          const nodes = new DataSet(
                            HashtagNet.data.data.relation.nodes
                          );
                          const node = nodes.get(event.nodes[0]);
                          if (node && !Array.isArray(node)) {
                            setTagNode(node);
                          } else {
                            setTagNode(null);
                          }
                        },
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant={"outline"}
                  onClick={() =>
                    tagRelationExport(from!, to!, HashtagNet.data.data.relation)
                  }
                >
                  Export (.gdf)
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Card className="relative">
        <CardHeader>
          <CardTitle>Interest Network</CardTitle>
        </CardHeader>
        <CardContent className="h-[450px]">
          {InterestNet.data && (
            <>
              <Graph
                data={InterestNet.data.network ?? []}
                onClick={(node) => {
                  if (node) {
                    setNode(node.data);
                  } else {
                    setNode(null);
                  }
                }}
                showDynamicLabels={label}
              />
              {node ? (
                <div className="absolute bottom-2 left-2 h-3/5 w-64 flex flex-col gap-2 border rounded-md p-2 shadow-lg backdrop-blur-md">
                  <h6 className="text-wrap">{node.author_name}</h6>
                  <Link
                    target="_blank"
                    href={`https://www.tiktok.com/@${node.author_name}/video/${node.id}`}
                    className="bg-green-300 hover:bg-green-400 rounded-md p-1.5 text-sm text-center justify-center items-center"
                  >
                    View Video
                  </Link>
                  <span className="text-xs overflow-y-auto">{node.desc}</span>
                </div>
              ) : null}
              <div className="absolute top-2 right-2 space-x-3">
                <Dialog>
                  <DialogTrigger>
                    <Button size={"icon"} variant={"outline"}>
                      <Expand size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="min-w-[90%] h-[90%]">
                    <Graph
                      data={InterestNet.data.network}
                      onClick={(node) => {
                        if (node) {
                          setNode(node.data);
                        } else {
                          setNode(null);
                        }
                      }}
                      showDynamicLabels={label}
                    />
                  </DialogContent>
                </Dialog>
                <Toggle
                  pressed={label}
                  onPressedChange={setLabel}
                  className={buttonVariants({ variant: "outline" })}
                >
                  Show Label
                </Toggle>
                <Button
                  variant={"outline"}
                  onClick={() =>
                    interestNetExport(from!, to!, InterestNet.data.data.network)
                  }
                >
                  Export (.gdf)
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
