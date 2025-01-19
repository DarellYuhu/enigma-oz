"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { COLORS } from "@/constants";
import useFacebookTopics from "@/hooks/features/facebook/useFacebookTopics";
import ReactMarkdown from "react-markdown";
import * as Tabs from "@radix-ui/react-tabs";
import { MetricCard } from "@/components/MetricCard";
import { MessageCircle, Share2, ThumbsUp } from "lucide-react";
import { GrMultimedia } from "react-icons/gr";
import { TbWorldWww } from "react-icons/tb";
import RechartHorizontal from "@/components/charts/RechartHorizontal";
import Datatable from "@/components/datatable/Datatable";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Topics() {
  const { data } = useFacebookTopics();

  return (
    <div>
      {data && (
        <Tabs.Root className="space-y-4" defaultValue="0">
          <ScrollArea className="w-full overflow-x-auto ">
            <Tabs.TabsList className="flex flex-row w-full bg-gray-300 rounded-md p-2 gap-2">
              {Object.entries(data.classes)
                .filter(([_, value]) => value.representation !== "")
                .map((_, index) => (
                  <Tabs.TabsTrigger
                    key={index}
                    value={index.toString()}
                    className={
                      "p-2 w-10 h-10w-10 rounded-md data-[state=active]:opacity-35 data-[state=active]:shadow-md transition-all duration-300"
                    }
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                ))}
            </Tabs.TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {Object.entries(data.classes)
            .filter(([_, item]) => item.representation !== "")
            .map(([key, item], index) => (
              <Tabs.TabsContent
                key={index}
                value={index.toString()}
                className="grid grid-cols-12 gap-3"
              >
                <div className="grid grid-cols-12 gap-3 col-span-8">
                  <Card className="col-span-6 lg:col-span-4">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">
                        Representation
                      </CardTitle>
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
                <div className="col-span-4 space-y-3">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">
                        Content and Domains
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                      <MetricCard
                        data={{
                          name: "Contents",
                          value: item.num_contents,
                          description: "",
                          reactIcon: GrMultimedia,
                        }}
                      />
                      <MetricCard
                        data={{
                          name: "Domains",
                          value: item.num_domains,
                          description: "",
                          reactIcon: TbWorldWww,
                        }}
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Engagements</CardTitle>
                      <CardDescription>
                        Total: {item.total_engagements}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-3">
                      <MetricCard
                        data={{
                          name: "Likes",
                          value: item.total_likes,
                          description: "",
                          lucideIcon: ThumbsUp,
                        }}
                      />
                      <MetricCard
                        data={{
                          name: "Comments",
                          value: item.total_comments,
                          description: "",
                          lucideIcon: MessageCircle,
                        }}
                      />
                      <MetricCard
                        data={{
                          name: "Shares",
                          value: item.total_shares,
                          description: "",
                          lucideIcon: Share2,
                        }}
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Reactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RechartHorizontal
                        dataKey="value"
                        labelKey="name"
                        label="Reaction"
                        data={reactionKeys.map((key) => ({
                          name: reactionLabels[
                            key as keyof typeof reactionLabels
                          ],
                          value: item[key as keyof typeof item],
                        }))}
                      />
                    </CardContent>
                  </Card>
                </div>
                <Datatable
                  columns={columns}
                  data={data.articles[key] ?? []}
                  className="col-span-full"
                  initialSorting={[{ id: "engagement", desc: true }]}
                />
              </Tabs.TabsContent>
            ))}
        </Tabs.Root>
      )}
    </div>
  );
}

const columns: ColumnDef<{
  class: string;
  id: string;
  domain: string;
  title: string;
  url: string;
  engagement: number;
}>[] = [
  {
    accessorKey: "domain",
    header: "Domain",
    cell: ({ row }) => (
      <div className="text-wrap">{row.getValue("domain")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "engagement",
    header: "Engagement",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <Link
        className={buttonVariants({ variant: "outline" })}
        href={row.original.url}
        target="_blank"
      >
        View Article
      </Link>
    ),
  },
];

const reactionKeys = [
  "total_haha",
  "total_love",
  "total_wow",
  "total_sad",
  "total_angry",
];
const reactionLabels = {
  total_haha: "Haha",
  total_love: "Love",
  total_wow: "Wow",
  total_sad: "Sad",
  total_angry: "Angry",
};
