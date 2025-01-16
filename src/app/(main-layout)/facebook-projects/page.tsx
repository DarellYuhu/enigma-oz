"use client";

import Datatable from "@/components/datatable/Datatable";
import { badgeVariants } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import useFacebookProjects, {
  FacebookProjects,
} from "@/hooks/features/facebook/useFacebookProjects";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export default function FacebookProjectsPage() {
  const { data, isPending } = useFacebookProjects();

  if (isPending) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-40 place-self-end" />
        <div className="grid grid-cols-12 gap-3">
          {Array.from({ length: 24 }).map((_, index) => (
            <Skeleton className="h-6 w-full col-span-3" key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="card dark:bg-slate-600 rounded-md shadow-md">
        <Datatable columns={columns} data={data?.projects || []} />
      </div>
    </div>
  );
}

const columns: ColumnDef<FacebookProjects["projects"][0]>[] = [
  {
    accessorKey: "projectName",
    header: "Project Name",
    cell: ({ row }) => (
      <Link
        href={`/facebook-projects/${row.original.projectId}`}
        className={badgeVariants({ variant: "default" })}
      >
        {row.original.projectName}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "created",
    header: "Created At",
  },
  {
    accessorKey: "lastUpdate",
    header: "Last Update",
  },
];
