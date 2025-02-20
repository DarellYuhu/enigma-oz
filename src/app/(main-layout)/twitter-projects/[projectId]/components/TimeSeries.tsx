"use client";

import useTwitterStatistics, {
  TwitterStatistics,
} from "@/hooks/features/twitter/useTwitterStatistics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import BarChart2 from "@/components/charts/BarChart2";
import SingleSelect from "@/components/SingleSelect";
import { useEffect, useState } from "react";
import adjustDateByFactor from "@/utils/adjustDateByFactor";
import DateRangePicker from "@/components/ui/date-range-picker";
import SearchInput from "@/components/SearchInput";
import useProjectInfo from "@/hooks/features/useProjectInfo";
import dateFormatter from "@/utils/dateFormatter";
import { Skeleton } from "@/components/ui/skeleton";
import AreaChart2 from "@/components/charts/AreaChart2";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import CsvDownload from "react-json-to-csv";

const TimeSeries = ({ projectId }: { projectId: string }) => {
  const [string, setString] = useState("");
  const [type, setType] = useState<keyof TwitterStatistics["ts"]>("daily");
  const { data: projectInfo } = useProjectInfo("TWITTER", projectId);
  const [date, setDate] = useState<
    { since?: Date; until?: Date } | undefined
  >();
  const { data, refetch, isPending } = useTwitterStatistics({
    projectId,
    since: date?.since && dateFormatter("ISO", date.since),
    until: date?.until && dateFormatter("ISO", date.until),
    string,
  });

  useEffect(() => {
    if (projectInfo?.lastUpdate) {
      setDate({
        since: adjustDateByFactor(-3, new Date(projectInfo.lastUpdate)),
        until: new Date(projectInfo.lastUpdate),
      });
    }
  }, [projectInfo?.lastUpdate]);

  const handleDownload = () => {};

  if (isPending)
    return (
      <div className="grid grid-cols-2 gap-4 h-60">
        <Skeleton className="h-full w-full col-span-1" />
        <Skeleton className="h-full w-full col-span-1" />
      </div>
    );

  if (!data) return null;
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-6">
          <CardHeader>
            <CardDescription>Accounts</CardDescription>
          </CardHeader>
          <CardContent className="h-60">
            <AreaChart2
              data={data.normalized[type]}
              dataKey="authors"
              labelKey="date"
              label="Authors"
            />
          </CardContent>
        </Card>
        <Card className="col-span-6">
          <CardHeader>
            <CardDescription>Tweets</CardDescription>
          </CardHeader>
          <CardContent className="h-60">
            <AreaChart2
              data={data.normalized[type]}
              dataKey="tweets"
              labelKey="date"
              label="Tweets"
            />
          </CardContent>
        </Card>
      </div>
      <div className="absolute top-4 right-4 flex flex-row gap-3">
        <CsvDownload data={data.normalized[type]} delimiter=",">
          <Button variant={"outline"} onClick={handleDownload}>
            <Download />
          </Button>
        </CsvDownload>
        <DateRangePicker
          date={{ from: date?.since, to: date?.until }}
          setDate={(value) =>
            setDate({
              since: value?.from,
              until: value?.to,
            })
          }
        />
        <SearchInput
          onChange={setString}
          onClick={() => {
            refetch();
          }}
        />
        <SingleSelect
          selections={selections}
          value={type}
          setValue={(value) => setType(value as typeof type)}
        />
      </div>
    </>
  );
};

const selections = [
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

export default TimeSeries;
