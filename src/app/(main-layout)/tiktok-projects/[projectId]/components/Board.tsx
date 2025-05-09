"use client";

import useCategoryStore from "@/store/category-store";
import useStatisticDateStore from "@/store/statistic-date-store";
import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MoreHorizontal } from "lucide-react";
import abbreviateNumber from "@/utils/abbreviateNumber";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTiktokBoards } from "@/hooks/features/user/useTiktokBoards";
import { useTiktokComments } from "@/hooks/features/tiktok/useTiktokComments";
import { useQueryFilterStore } from "@/store/query-filter-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import Datatable from "@/components/datatable/Datatable";
import useSelectionStore from "../store/selection-store";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  projectId: string;
};

const Board = ({ projectId }: Props) => {
  const [selected, setSelected] = useState<BoardItem | undefined>();
  const [keywords, setKeywords] = useState<string>("");
  const { category } = useCategoryStore();
  const { from, to } = useStatisticDateStore();
  const { query } = useQueryFilterStore();
  const { type } = useSelectionStore();
  const comments = useTiktokComments();
  const { data, isPending } = useTiktokBoards({
    projectId,
    string: query,
    from,
    to,
  });

  if (isPending)
    return (
      <div className="grid grid-cols-12 gap-3">
        {Array.from({ length: 24 }).map((_, index) => (
          <Skeleton className="w-full h-7 col-span-3" key={index} />
        ))}
      </div>
    );

  return (
    <div className="flex flex-col bg-white rounded-md">
      <div className="flex flex-row items-center justify-end m-2"></div>
      <Dialog>
        <ScrollArea className="h-80">
          <Datatable
            columns={columns(setSelected)}
            data={data?.normalize?.[type][category] || []}
          />
        </ScrollArea>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Comments into Excel</DialogTitle>
          </DialogHeader>
          <div>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Keyword or leave it blank"
            />
          </div>
          <DialogFooter className="text-sm">
            <button
              onClick={() =>
                comments.mutate({
                  id: selected?.id ?? "",
                  keywords: keywords,
                })
              }
              className="bg-green-400 dark:bg-green-500 rounded-md shadow-md p-2 hover:bg-green-500 dark:hover:bg-green-700 transition-all ease-in-out duration-200"
            >
              Export
            </button>
            <DialogClose className="bg-red-400 dark:bg-red-500 rounded-md shadow-md p-2 hover:bg-red-500 dark:hover:bg-red-700 transition-all ease-in-out duration-200">
              Cancel
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const columns: (
  setSelected: Dispatch<SetStateAction<BoardItem | undefined>>
) => ColumnDef<BoardItem>[] = (setSelected) => [
  {
    accessorKey: "author_name",
    header: "Creator",
  },
  {
    accessorKey: "desc",
    header: "Caption",
    cell: ({ row }) => {
      return (
        <span className="line-clamp-3 text-wrap hover:line-clamp-none break-all">
          {row.original.desc}
        </span>
      );
    },
  },
  {
    accessorKey: "play",
    header: "View",
    cell: ({ row }) => abbreviateNumber(row.original.play),
  },
  {
    accessorKey: "digg",
    header: "Like",
    cell: ({ row }) => abbreviateNumber(row.original.digg),
  },
  {
    accessorKey: "share",
    header: "Share",
    cell: ({ row }) => abbreviateNumber(row.original.share),
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => abbreviateNumber(row.original.comment),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DialogTrigger onClick={() => setSelected(row.original)}>
              <DropdownMenuItem>Export Comments</DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <Link
              target="_blank"
              href={`https://www.tiktok.com/@${row.original.author_name}/video/${row.original.id}`}
            >
              <DropdownMenuItem>Watch</DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => setSelected(row.original)}>
              Hide this video
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default Board;
