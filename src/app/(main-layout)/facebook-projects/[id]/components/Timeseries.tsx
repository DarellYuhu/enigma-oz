"use client";
import RechartArea from "@/components/charts/RechartArea";
import SingleSelect from "@/components/SingleSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useFacebookStatistics from "@/hooks/features/facebook/useFacebookStatistics";
import useStatisticDateStore from "@/store/statistic-date-store";
import abbreviateNumber from "@/utils/abbreviateNumber";
import { useEffect, useState } from "react";

export default function Timeseries({ lastUpdate }: { lastUpdate?: string }) {
  const [type, setType] = useState<"daily" | "weekly" | "monthly">("daily");
  const { setTo } = useStatisticDateStore();
  const { data } = useFacebookStatistics();

  useEffect(() => {
    if (lastUpdate) {
      setTo(new Date(lastUpdate));
    }
  }, [lastUpdate]);

  return (
    <div className="space-y-3">
      <div className="flex place-self-end">
        <SingleSelect
          selections={options}
          value={type}
          setValue={(value) => setType(value as typeof type)}
        />
      </div>
      {data && (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                <CardTitle>Number of Articles</CardTitle>
              </div>
              <div className="flex">
                <div
                  data-active={true}
                  className="flex flex-1 flex-col justify-center gap-1 border-t px-4 py-2 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-6 sm:py-4"
                >
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span className="text-lg font-bold leading-none sm:text-xl">
                    {abbreviateNumber(
                      data.ts[type].reduce((a, b) => a + b.num_articles, 0)
                    )}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-96">
              <RechartArea
                data={data.ts[type]}
                dataKey={"num_articles"}
                label={"Number of Articles"}
                labelKey="date"
                type={"basis"}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                <CardTitle>Engagements</CardTitle>
              </div>
              <div className="flex">
                <div
                  data-active={true}
                  className="flex flex-1 flex-col justify-center gap-1 border-t px-4 py-2 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-6 sm:py-4"
                >
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span className="text-lg font-bold leading-none sm:text-xl">
                    {abbreviateNumber(
                      data.ts[type].reduce((a, b) => a + b.engagements, 0)
                    )}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-96">
              <RechartArea
                data={data.ts[type]}
                dataKey={"engagements"}
                label={"Engagements"}
                labelKey="date"
                type={"basis"}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

const options = [
  {
    label: "Daily",
    value: "daily",
  },
  {
    label: "Weekly",
    value: "weekly",
  },
  {
    label: "Monthly",
    value: "monthly",
  },
];
