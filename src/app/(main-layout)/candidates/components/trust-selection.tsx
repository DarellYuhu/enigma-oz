"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export const TrustSelection = () => {
  const router = useRouter();
  const uriSearchParams = new URLSearchParams(window.location.search);
  const searchParams = useSearchParams();

  return (
    <Select
      value={searchParams.get("trust_type") ?? "TrustPos"}
      onValueChange={(val) => {
        if (val) uriSearchParams.set("trust_type", val);
        else uriSearchParams.delete("trust_type");
        router.push(`?${uriSearchParams.toString()}`);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"TrustPos"}>Trust Positive</SelectItem>
        <SelectItem value={"TrustUnd"}>Undecided</SelectItem>
      </SelectContent>
    </Select>
  );
};
