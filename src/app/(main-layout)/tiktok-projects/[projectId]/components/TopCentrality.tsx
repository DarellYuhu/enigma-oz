"use client";

import Datatable from "@/components/datatable/Datatable";
import { DataTableColumnHeader } from "@/components/datatable/DataTableColumnHeader";
import { badgeVariants } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import useTiktokInterestNet2, {
  GetInterestGraphs,
  InterestNetwork2,
} from "@/hooks/features/tiktok/useTiktokInterestNet2";
import abbreviateNumber from "@/utils/abbreviateNumber";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import useGraphConfigStore from "../store/graph-config-store";
import SingleSelect from "@/components/SingleSelect";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfigStore } from "../store/config-store";

const TopCentrality = ({ projectId }: { projectId: string }) => {
  const { window } = useConfigStore();
  const { to } = useGraphConfigStore();
  const [type, setType] =
    useState<
      keyof Pick<
        InterestNetwork2["network"]["nodes"]["0"],
        "centrality_pr" | "centrality_bw" | "centrality_dg"
      >
    >("centrality_pr");
  const { data, isPending } = useTiktokInterestNet2({
    projectId,
    window,
    date: to!,
  });

  if (isPending)
    return (
      <div className="p-4 h-80">
        <Skeleton className="w-full h-full" />
      </div>
    );

  if (!data) return null;
  return (
    <>
      <ScrollArea className="h-80">
        <Datatable
          data={data?.normalized.network.nodes
            .sort((a, b) => b.data[type] - a.data[type])
            .slice(0, 10)
            .map((item) => ({
              ...item.data,
            }))}
          columns={columns}
          pagination={false}
          initialPageSize={10}
        />
      </ScrollArea>
      <div className="absolute top-4 right-4">
        <SingleSelect
          selections={selections}
          setValue={(value) => setType(value as typeof type)}
          value={type}
        />
      </div>
    </>
  );
};

const selections = [
  {
    label: "PageRank",
    value: "centrality_pr",
  },
  {
    label: "Betweenness",
    value: "centrality_bw",
  },
  {
    label: "Degree",
    value: "centrality_dg",
  },
];

const columns: ColumnDef<
  GetInterestGraphs["normalized"]["network"]["nodes"][0]["data"]
>[] = [
  {
    accessorKey: "author_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
    cell(props) {
      return (
        <Link
          className={badgeVariants({ variant: "outline" })}
          href={`https://www.tiktok.com/@${props.row.original.author_name}/video/${props.row.original.id}`}
          target="_blank"
        >
          {props.row.original.author_name}
        </Link>
      );
    },
  },
  {
    accessorKey: "play",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Views" />
    ),
    cell(props) {
      return abbreviateNumber(props.row.original.play);
    },
  },
];

export default TopCentrality;
