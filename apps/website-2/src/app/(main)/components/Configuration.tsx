"use client";

import { usePages } from "@/hooks/feature/use-pages";
import { usePageConfigStore } from "@/stores/page-config-store";
import { Button, DateRangePicker } from "ui/components/";

export default function Configuration() {
  const { refetch } = usePages();
  const { from, to, setFrom, setTo } = usePageConfigStore();
  return (
    <div className="flex flex-row justify-end gap-3">
      <DateRangePicker
        date={{ from, to }}
        setDate={(date) => {
          setFrom(date?.from);
          setTo(date?.to);
        }}
      />
      <Button disabled={!from || !to} onClick={() => refetch()}>
        Apply
      </Button>
    </div>
  );
}
