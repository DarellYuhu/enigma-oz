"use client";

import Datatable from "@/components/datatable/Datatable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WIN_CONTENDER from "@/data/win_contender.json";
import { ColumnDef } from "@tanstack/react-table";

export const WinContender = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Win Contender</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className="italic font-bold">Chance to win</p>
          <Datatable
            columns={columns}
            data={WIN_CONTENDER.data.chance_to_win.sort(
              (a, b) => b.value - a.value
            )}
          />
        </div>
        <div>
          <p className="italic font-bold">Strong Contender</p>
          <Datatable
            columns={columns}
            data={WIN_CONTENDER.data.strong_contender.sort(
              (a, b) => b.value - a.value
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const columns: ColumnDef<{ candidate: string; value: number }>[] = [
  {
    accessorKey: "rank",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "candidate",
    header: "Candidate",
    cell({ row }) {
      return (
        <div className="flex flex-row gap-2 items-center">
          <Avatar>
            <AvatarImage src={`/photo/${row.original.candidate}.png`} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {row.original.candidate}
        </div>
      );
    },
  },
  {
    accessorKey: "value",
    header: "Value",
  },
];
