"use client";
import Datatable from "@/components/datatable/Datatable";
import useActorNetwork, {
  ActorNetwork,
} from "@/hooks/features/trends/useActorNetwork";
import useConfigStore from "../store/config-store";
import { ColumnDef } from "@tanstack/react-table";
import dateFormatter from "@/utils/dateFormatter";
import { Skeleton } from "@/components/ui/skeleton";

const TopCentrality = ({ details }: { details: string }) => {
  const { category, networkDate, networkType } = useConfigStore();
  const { data, isPending } = useActorNetwork({
    category,
    date:
      typeof networkDate === "string"
        ? networkDate
        : dateFormatter("ISO", networkDate),
    rid: details,
    window: parseInt(networkType),
  });

  if (isPending)
    return (
      <div className="grid grid-cols-12 gap-3">
        <Skeleton className="w-full h-8 col-span-4" />
        <Skeleton className="w-full h-8 col-span-4" />
        <Skeleton className="w-full h-8 col-span-4" />
        <Skeleton className="w-full h-8 col-span-4" />
        <Skeleton className="w-full h-8 col-span-4" />
        <Skeleton className="w-full h-8 col-span-4" />
        <Skeleton className="w-full h-8 col-span-4" />
        <Skeleton className="w-full h-8 col-span-4" />
        <Skeleton className="w-full h-8 col-span-4" />
      </div>
    );

  if (!data) return null;
  return (
    <Datatable
      data={data.centrality}
      columns={columns}
      pagination={false}
      initialPageSize={10}
    />
  );
};

const columns: ColumnDef<ActorNetwork["network"]["nodes"][0]>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "centrality",
    header: "Centrality",
    cell(props) {
      return props.row.original.centrality.toFixed(3);
    },
  },
];

export default TopCentrality;
