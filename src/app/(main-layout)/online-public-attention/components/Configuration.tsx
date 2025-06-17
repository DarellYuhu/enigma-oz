"use client";
import useTrends from "@/hooks/features/trends/useTrends";

import useConfigStore from "../store/config-store";
import { Label } from "@/components/ui/label";
import DateRangePicker from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Configuration = ({ details }: { details: string }) => {
  const { category, level, since, until, setDate } = useConfigStore();
  const { refetch } = useTrends({
    category,
    level,
    details,
    since: since!,
    until: until!,
  });
  return (
    <Card>
      <CardContent className="space-y-4 p-7">
        <Label>Date Range</Label>
        <div className="flex flex-row justify-between gap-3">
          <div className="w-full">
            <DateRangePicker
              date={{ from: since, to: until }}
              setDate={(date) =>
                setDate({ since: date?.from, until: date?.to })
              }
              numberOfMonths={2}
            />
          </div>
          <Button disabled={!since || !until} onClick={() => refetch()}>
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Configuration;
