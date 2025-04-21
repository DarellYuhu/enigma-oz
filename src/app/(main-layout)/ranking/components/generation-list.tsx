"use client";

import Datatable from "@/components/datatable/Datatable";
import { ColumnDef } from "@tanstack/react-table";
import rank from "@/data/candidate_rank_demography.json";
import { useState } from "react";
import SingleSelect from "@/components/SingleSelect";

export const GenerationList = () => {
  const [type, setType] =
    useState<keyof (typeof rank)["data"]["Generation"]>("Millennials");

  return (
    <>
      <SingleSelect
        selections={[
          { value: "Boomers", label: "Boomers" },
          { value: "Millennials", label: "Millennials" },
          { value: "Gen X", label: "Gen X" },
          { value: "Gen Z", label: "Gen Z" },
        ]}
        value={type}
        setValue={(v) => setType(v as typeof type)}
      />
      <Datatable columns={columns} data={rank["data"]["Generation"][type]} />
    </>
  );
};

const columns: ColumnDef<
  (typeof rank)["data"]["Generation"]["Boomers"]["0"]
>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
  },
  {
    accessorKey: "candidate",
    header: "Candidate",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
];
