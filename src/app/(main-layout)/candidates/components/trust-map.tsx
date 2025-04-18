"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Maps } from "./maps";
import trust from "@/data/candidate_trust.json";
import { useState } from "react";

export const TrustMap = ({ candidateKey }: { candidateKey: string }) => {
  const [type, setType] = useState<"TrustPos" | "TrustUnd">("TrustPos");

  return (
    <>
      <Select
        value={type}
        onValueChange={(val) => {
          if (val) setType(val as typeof type);
        }}
      >
        <SelectTrigger className="absolute top-2 right-2 w-fit">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"TrustPos"}>Trust Positive</SelectItem>
          <SelectItem value={"TrustUnd"}>Undecided</SelectItem>
        </SelectContent>
      </Select>
      <div className="h-full">
        <Maps
          item={trust.data[candidateKey as keyof typeof trust.data][type]}
        />
      </div>
    </>
  );
};
