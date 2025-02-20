"use client";

import useTwitterClusterStats, {
  ClusterStats,
} from "@/hooks/features/twitter/useTwitterClusterStats";
import RechartArea from "@/components/charts/RechartArea";
import SingleSelect from "@/components/SingleSelect";
import { useEffect, useState } from "react";
import DateRangePicker from "@/components/ui/date-range-picker";
import adjustDateByFactor from "@/utils/adjustDateByFactor";
import dateFormatter from "@/utils/dateFormatter";
import useProjectInfo from "@/hooks/features/useProjectInfo";
import { Skeleton } from "@/components/ui/skeleton";
import CsvDownload from "react-json-to-csv";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const ClusterStatistics = ({ projectId }: { projectId: string }) => {
  const { data: projectInfo } = useProjectInfo("TWITTER", projectId);
  const [date, setDate] = useState<{ since?: Date; until?: Date }>({
    since: adjustDateByFactor(-3, new Date()),
    until: new Date(),
  });
  const [type, setType] =
    useState<keyof Omit<ClusterStats["ts"], "date">>("num_clusters_gc");
  const { data, isPending } = useTwitterClusterStats({
    projectId,
    since: date.since ? dateFormatter("ISO", date.since) : "",
    until: date.until ? dateFormatter("ISO", date.until) : "",
    string: "",
  });

  useEffect(() => {
    if (projectInfo?.lastUpdate) {
      setDate({
        ...date,
        until: new Date(projectInfo.lastUpdate),
      });
    }
  }, [projectInfo?.lastUpdate]);

  if (isPending) return <Skeleton className="h-full w-full" />;

  return (
    <>
      <RechartArea
        data={data?.normalized || []}
        labelKey="date"
        dataKey={type}
        label="Number of Clusters"
        xAxisHide={true}
      />
      <div className="absolute right-4 top-4 flex flex-row gap-4">
        <CsvDownload data={data?.normalized ?? []} delimiter=",">
          <Button variant={"outline"}>
            <Download />
          </Button>
        </CsvDownload>

        <DateRangePicker
          date={{ from: date.since, to: date.until }}
          setDate={(value) =>
            setDate({
              since: value?.from,
              until: value?.to,
            })
          }
        />
        <SingleSelect
          selections={selections}
          value={type}
          setValue={(value) => setType(value as typeof type)}
          placeholder="Select a type"
        />
      </div>
    </>
  );
};

const selections = [
  {
    label: "Number of clusters in GC",
    value: "num_clusters_gc",
  },
  {
    label: "Number of clusters",
    value: "num_clusters",
  },
];

export default ClusterStatistics;
