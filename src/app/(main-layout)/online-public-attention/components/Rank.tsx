"use client";
import Datatable from "@/components/datatable/Datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useTrends from "@/hooks/features/trends/useTrends";
import useConfigStore from "../store/config-store";
import { ColumnDef } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  Minus,
  MoveRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Rank = ({ details }: { details: string }) => {
  const { category, level, since, until, type } = useConfigStore();
  const { data, isPending } = useTrends({
    category,
    level,
    details,
    since: since!,
    until: until!,
  });

  if (isPending)
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="grid grid-cols-12 gap-3" key={index}>
            <Skeleton className="w-full h-8 col-span-4" />
            <Skeleton className="w-full h-8 col-span-4" />
            <Skeleton className="w-full h-8 col-span-4" />
          </div>
        ))}
      </div>
    );

  if (!data) return null;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Rank</CardTitle>
      </CardHeader>
      <CardContent>
        <Datatable
          columns={columns}
          data={data.rank[type]}
          pagination={false}
          initialPageSize={10}
        />
      </CardContent>
    </Card>
  );
};

const columns: ColumnDef<
  NonNullable<ReturnType<typeof useTrends>["data"]>["rank"]["week"]["0"]
>[] = [
  {
    accessorKey: "rank",
    header: "Rank (#)",
    cell({ row }) {
      let icon: JSX.Element;
      if (row.original.rankDiff > 0) {
        icon = <ChevronUp height={12} className="text-green-500" />;
      } else if (row.original.rankDiff < 0) {
        icon = <ChevronDown height={12} className="text-red-500" />;
      } else {
        icon = <Minus height={12} />;
      }
      return row.original.rankDiff !== 0 ? (
        <span className="flex flex-row items-center gap-5">
          {row.original.rank}{" "}
          <span
            className="flex flex-row items-center text-[11px]"
            style={{
              color: row.original.rankDiff > 0 ? "#22c55e" : "#ef4444",
            }}
          >
            {icon} {Math.abs(row.original.rankDiff)}
          </span>
        </span>
      ) : (
        <span>{row.original.rank}</span>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "curr",
    header: "Last (%)",
  },
  {
    accessorKey: "prev",
    header: "Previous (%)",
  },
  {
    accessorKey: "diff",
    header: "Change (%)",
    cell({ row }) {
      let Icon: JSX.Element;

      switch (true) {
        case parseFloat(row.original.diff) > 0:
          Icon = <TrendingUp size={14} className="text-green-500" />;
          break;
        case parseFloat(row.original.diff) < 0:
          Icon = <TrendingDown size={14} className="text-red-500" />;
          break;
        default:
          Icon = <MoveRight size={14} />;
          break;
      }

      return (
        <span className="flex flex-row items-center gap-2">
          {parseFloat(row.original.diff).toFixed(2)}
          {Icon}
        </span>
      );
    },
  },
];

export default Rank;
