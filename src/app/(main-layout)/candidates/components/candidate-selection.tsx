"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import metric from "@/data/candidate_metric.json";
import { sortBy } from "lodash";

export const CandidateSelection = () => {
  const router = useRouter();
  const uriSearchParams = new URLSearchParams();
  const searchParams = useSearchParams();

  return (
    <Select
      value={searchParams.get("key") ?? ""}
      onValueChange={(val) => {
        if (val) uriSearchParams.set("key", val);
        else uriSearchParams.delete("key");
        router.push(`?${uriSearchParams.toString()}`);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select candidate" />
      </SelectTrigger>
      <SelectContent>
        {sortBy(Object.keys(metric.data)).map((key, idx) => (
          <SelectItem value={key} key={idx}>
            {key}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
