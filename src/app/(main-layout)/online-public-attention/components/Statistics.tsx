"use client";
import useActorNetwork from "@/hooks/features/trends/useActorNetwork";
import { useEffect } from "react";
import useConfigStore from "../store/config-store";
import dateFormatter from "@/utils/dateFormatter";
import RechartMultiLine from "@/components/charts/RechartMultiLine";
import SingleSelect from "@/components/SingleSelect";
import { Skeleton } from "@/components/ui/skeleton";

const Statistics = ({ details }: { details: string }) => {
  const {
    category,
    networkDate,
    networkType,
    lineType,
    setNetworkDate,
    setLineType,
  } = useConfigStore();
  const { data, isPending } = useActorNetwork({
    category,
    date:
      typeof networkDate === "string"
        ? networkDate
        : dateFormatter("ISO", networkDate),
    rid: details,
    window: parseInt(networkType),
  });

  useEffect(() => {
    if (data?.data.date) {
      setNetworkDate(new Date(data?.data.date));
    }
  }, [data?.data.date]);

  if (isPending) return <Skeleton className="h-40 w-full" />;

  if (!data) return null;

  return (
    <>
      <RechartMultiLine
        config={[
          {
            dataKey: lineType,
            color: "hsl(var(--chart-1))",
            label: selections.find((item) => item.value === lineType)!.label!,
            labelKey: "date",
          },
        ]}
        type={"linear"}
        domain={["dataMin", "dataMax"]}
        data={data.statistics}
      />
      <div className="absolute top-4 right-4">
        <SingleSelect
          selections={selections}
          value={lineType}
          setValue={(value) => setLineType(value as typeof lineType)}
        />
      </div>
    </>
  );
};

const selections = [
  {
    label: "Average Path Length",
    value: "apl",
  },
  {
    label: "Largest Eigenvalue",
    value: "largest_eig",
  },
  {
    label: "Largest Eigenvalue (%)",
    value: "largest_eig_pct",
  },
];

export default Statistics;
