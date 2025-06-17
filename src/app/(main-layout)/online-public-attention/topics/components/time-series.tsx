"use client";

import RechartMultiLine from "@/components/charts/RechartMultiLine";
import MultipleSelector from "@/components/MultiSelect";
import SingleSelect from "@/components/SingleSelect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Params = {
  options: {
    label: string;
    value: string;
  }[];
  dic: OpaRes["dic"];
  colors: Record<string, string>;
  data: {
    week: OpaNormalizedData[];
    month: OpaNormalizedData[];
  } | null;
};

export const TimeSeries = ({ options, dic, colors, data }: Params) => {
  const searchParams = useSearchParams();
  const selectedQuery = searchParams.get("selected");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [selected, setSelected] = useState<{ label: string; value: string }[]>(
    []
  );

  const handleSubmit = () => {
    const params = new URLSearchParams();
    if (selected.length > 0)
      params.set("selected", selected.map((s) => s.value).join(" "));
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  useEffect(() => {
    if (selectedQuery) {
      const selections = selectedQuery
        .split(" ")
        .map((item) => {
          const option = options.find((o) => o.value === item);
          return option ? { label: option.label, value: option.value } : null;
        })
        .filter(Boolean) as { label: string; value: string }[];

      setSelected(selections);
    }
    if (!selectedQuery) setSelected(options.slice(0, 3));
  }, [selectedQuery]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Series</CardTitle>
        <CardDescription></CardDescription>
        <div className="flex gap-2">
          <SingleSelect
            selections={selections}
            value={period}
            setValue={(value) => setPeriod(value as typeof period)}
          />
          <MultipleSelector
            commandProps={{
              label: "Select...",
            }}
            value={selected}
            defaultOptions={options}
            onChange={setSelected}
            placeholder="Select..."
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={
              <p className="text-center text-sm">No results found</p>
            }
          />
          <Button disabled={isPending} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <RechartMultiLine
          config={dic.map((item) => ({
            color: colors[item.key],
            dataKey: item.key,
            label: item.name,
            labelKey: "date",
          }))}
          data={data ? data[period] : []}
          tickFormatter={(value) =>
            value
              ? new Date(value).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                })
              : ""
          }
        />
      </CardContent>
    </Card>
  );
};

const selections = [
  {
    value: "week",
    label: "Weekly",
  },
  {
    value: "month",
    label: "Monthly",
  },
];
