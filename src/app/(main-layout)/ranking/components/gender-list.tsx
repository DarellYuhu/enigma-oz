"use client";

import Datatable from "@/components/datatable/Datatable";
import { ColumnDef } from "@tanstack/react-table";
import rank from "@/data/candidate_rank_demography.json";
import { useState } from "react";
import SingleSelect from "@/components/SingleSelect";

export const GenderList = () => {
  const [type, setType] =
    useState<keyof (typeof rank)["data"]["Gender"]>("Male");

  return (
    <>
      <SingleSelect
        selections={[
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ]}
        value={type}
        setValue={(v) => setType(v as typeof type)}
      />
      <Datatable columns={columns} data={rank["data"]["Gender"][type]} />
    </>
  );
};

const columns: ColumnDef<(typeof rank)["data"]["Gender"]["Female"]["0"]>[] = [
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
