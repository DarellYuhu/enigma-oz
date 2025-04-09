"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ALargeSmall,
  CalendarArrowUp,
  CalendarPlus,
  CircleAlert,
  Clapperboard,
  FilePenLine,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTiktokProjects } from "@/hooks/features/tiktok/useTiktokProjects";
import { useCreateTTProject } from "@/hooks/features/tiktok/useCreateTTProject";
import TiktokSchema from "@/schemas/tiktok";
import { useSession } from "next-auth/react";
import EditDialog from "./components/EditDialog";
import Datatable from "@/components/datatable/Datatable";
import { buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PiGraph } from "react-icons/pi";

type Project = {
  projectId: string;
  projectName: string;
  status: string;
  created: Date;
  lastUpdate: Date;
  numVideos: number;
};

const Projects = () => {
  const [selected, setSelected] = useState<Project | undefined>();
  const { data: session } = useSession();
  const { isPending, data } = useTiktokProjects();
  const projectsMutation = useCreateTTProject();
  const createForm = useForm<z.infer<typeof TiktokSchema.create>>({
    resolver: zodResolver(TiktokSchema.create),
    defaultValues: {
      projectName: "",
      keywords: "",
    },
  });

  const onSubmit = (values: z.infer<typeof TiktokSchema.create>) => {
    projectsMutation.mutate(values);
    createForm.reset();
  };

  if (isPending)
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
  return (
    <div className="flex flex-col gap-3">
      <Dialog>
        <DialogTrigger
          disabled={session?.user.role === "VIEWER"}
          className={cn(buttonVariants(), "self-end")}
        >
          Create New
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-slate-800 border-0">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <FormField
                control={createForm.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Project Name</FormLabel>
                    <FormControl className="bg-slate-200 dark:bg-slate-600 text-sm p-2 rounded-sm">
                      <input placeholder="Type here the name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Keywords</FormLabel>
                    <FormControl className="bg-slate-200 dark:bg-slate-600 text-sm p-2 rounded-sm">
                      <textarea
                        rows={4}
                        placeholder="Type here the keywords"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Seperate by comma (,)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="text-sm">
                <button
                  type="submit"
                  className="bg-green-400 dark:bg-green-500 rounded-md shadow-md p-2 hover:bg-green-500 dark:hover:bg-green-700 transition-all ease-in-out duration-200"
                >
                  Submit
                </button>
                <DialogClose className="bg-red-400 dark:bg-red-500 rounded-md shadow-md p-2 hover:bg-red-500 dark:hover:bg-red-700 transition-all ease-in-out duration-200">
                  Cancel
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="card bg-white dark:bg-slate-600 rounded-md">
        <Dialog onOpenChange={(open) => !open && selected}>
          <Datatable
            columns={columns(session?.user.role === "VIEWER", setSelected)}
            data={data?.projects || []}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <EditDialog project={selected} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

type ColumnProps = (
  isDisabled: boolean,
  setSelected: React.Dispatch<React.SetStateAction<Project | undefined>>
) => ColumnDef<Project>[];

const columns: ColumnProps = (isDisabled, setSelected) => [
  {
    accessorKey: "projectName",
    cell(props) {
      return (
        <Link
          className={badgeVariants({ variant: "default" })}
          href={`/tiktok-projects/${props.row.original.projectId}`}
        >
          {props.row.original.projectName}
        </Link>
      );
    },
    header: () => {
      return (
        <div className="flex flex-row gap-2 items-center">
          <ALargeSmall width={20} height={20} /> Project Name
        </div>
      );
    },
  },
  {
    accessorKey: "numVideos",
    header: () => {
      return (
        <div className="flex flex-row gap-2 items-center">
          <Clapperboard width={18} height={18} /> Number of Videos
        </div>
      );
    },
  },
  {
    accessorKey: "created",
    header: () => {
      return (
        <div className="flex flex-row gap-2 items-center">
          <CalendarPlus width={18} height={18} /> Created At
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <span>{new Date(row.getValue("created")).toLocaleDateString()}</span>
      );
    },
  },
  {
    accessorKey: "lastUpdate",
    header: () => {
      return (
        <div className="flex flex-row gap-2 items-center">
          <CalendarArrowUp width={18} height={18} /> Updated At
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <span>{new Date(row.getValue("lastUpdate")).toLocaleDateString()}</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return (
        <div className="flex flex-row gap-2 items-center">
          <CircleAlert width={18} height={18} /> Status
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => {
      return (
        <div className="flex flex-row gap-2 items-center">
          <CircleAlert width={18} height={18} /> Action
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="space-x-2">
          <DialogTrigger
            className={buttonVariants({ size: "sm", variant: "outline" })}
            onClick={(event) => {
              setSelected(row.original);
              event.stopPropagation();
            }}
            disabled={isDisabled}
          >
            <FilePenLine width={16} height={16} />
            Edit
          </DialogTrigger>
          <Link
            href={`/tiktok-projects/${row.original.projectId}/graph-explorer`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <PiGraph /> Graph
          </Link>
        </div>
      );
    },
  },
];

export default Projects;
