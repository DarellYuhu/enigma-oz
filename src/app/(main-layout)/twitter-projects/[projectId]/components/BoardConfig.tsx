"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import useBoardConfigStore from "../store/board-config-store";
import adjustDateByFactor from "@/utils/adjustDateByFactor";
import { useSearchParams } from "next/navigation";

const BoardConfig = () => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const [query, setQuery] = useState("");
  const [toggleValue, setToggleValue] = useState("3");
  const { setDate, setString } = useBoardConfigStore();

  useEffect(() => {
    switch (toggleValue) {
      case "1":
        setDate({
          from: adjustDateByFactor(-1, new Date(date || "")),
          to: new Date(date || ""),
        });
        break;
      case "3":
        setDate({
          from: adjustDateByFactor(-3, new Date(date || "")),
          to: new Date(date || ""),
        });
        break;
      case "7":
        setDate({
          from: adjustDateByFactor(-7, new Date(date || "")),
          to: new Date(date || ""),
        });
        break;
    }
  }, [toggleValue]);

  return (
    <div className="flex flex-row gap-2">
      <ToggleGroup
        type="single"
        defaultValue="3"
        value={toggleValue}
        onValueChange={setToggleValue}
      >
        <ToggleGroupItem variant={"outline"} value="1">
          1d
        </ToggleGroupItem>
        <ToggleGroupItem variant={"outline"} value="3">
          3d
        </ToggleGroupItem>
        <ToggleGroupItem variant={"outline"} value="7">
          7d
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="relative">
        <Input
          id="input-26"
          className="peer pe-9 ps-9"
          placeholder="Search..."
          type="search"
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search size={16} strokeWidth={2} />
        </div>
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          onClick={() => {
            setString({ string: query });
          }}
        >
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default BoardConfig;
