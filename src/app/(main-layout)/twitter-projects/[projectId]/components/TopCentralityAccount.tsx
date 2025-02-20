"use client";

import Datatable from "@/components/datatable/Datatable";
import { ScrollArea } from "@/components/ui/scroll-area";
import useTwitterAccountNet, {
  AccountNetwork,
} from "@/hooks/features/twitter/useTwitterAccountNet";
import { ColumnDef } from "@tanstack/react-table";
import abbreviateNumber from "@/utils/abbreviateNumber";
import SingleSelect from "@/components/SingleSelect";
import { useState } from "react";
import useAccountStore from "../store/account-config-store";
import dateFormatter from "@/utils/dateFormatter";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge, badgeVariants } from "@/components/ui/badge";

const TopCentralityAccount = ({ projectId }: { projectId: string }) => {
  const [type, setType] =
    useState<
      keyof Pick<
        AccountNetwork["network"]["nodes"][0],
        "centrality_bw" | "centrality_dg" | "centrality_pr"
      >
    >("centrality_pr");
  const { date } = useAccountStore();
  const { data, isPending } = useTwitterAccountNet({
    projectId,
    Window: 1,
    date: date ? dateFormatter("ISO", date) : "",
  });

  if (isPending) return <Skeleton className="h-[400px] w-full" />;

  return (
    <>
      <ScrollArea className="h-[400px]">
        <Datatable
          data={
            data?.normalized.network.nodes
              .sort((a, b) => b.data[type] - a.data[type])
              .slice(0, 10)
              .map((item) => ({
                ...item.data,
              })) || []
          }
          columns={columns}
          pagination={false}
          initialPageSize={10}
        />
      </ScrollArea>
      <div className="absolute top-4 right-4">
        <SingleSelect
          selections={selections}
          value={type}
          setValue={(value) => setType(value as typeof type)}
          placeholder="Select a type"
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

const columns: ColumnDef<AccountNetwork["network"]["nodes"][0]>[] = [
  {
    accessorKey: "user_screen_name",
    header: "Name",
    cell(props) {
      return (
        <Link
          href={`https://x.com/${props.row.original.user_screen_name}`}
          target="_blank"
          className={badgeVariants({ variant: "outline" })}
        >
          {props.row.original.user_screen_name}
        </Link>
      );
    },
  },
  {
    accessorKey: "num_followers",
    header: "Followers",
    cell(props) {
      return abbreviateNumber(props.row.original.num_followers);
    },
  },
];

export default TopCentralityAccount;
