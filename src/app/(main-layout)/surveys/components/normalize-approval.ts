export type Approval = {
  data: Record<
    string,
    Record<
      "approve" | "disapprove" | "undecided",
      Record<
        "surveys" | "monthly" | "weekly",
        {
          date_str: string[];
          timestamp: number[];
          surveyor: string[];
          value: number[];
          high: number[];
          low: number[];
        }
      >
    >
  >;
  officials: Record<number, string>;
};

export const normalizeApproval = (
  approval: Approval,
  seriesType: "weekly" | "monthly",
  type: "approve" | "disapprove" | "undecided",
  officialIds: string[]
) => {
  const allTimestampsSet = new Set<number>();

  // Collect timestamps from both surveys and weekly for every official.
  officialIds.forEach((id) => {
    const approveData = (approval.data as unknown as Approval["data"])[id][
      type
    ];
    if (approveData.surveys?.timestamp) {
      approveData.surveys.timestamp.forEach((ts) => allTimestampsSet.add(ts));
    }
    if (approveData[seriesType]?.timestamp) {
      approveData[seriesType].timestamp.forEach((ts) =>
        allTimestampsSet.add(ts)
      );
    }
  });

  // Create a sorted array of all unique timestamps.
  const allDates = Array.from(allTimestampsSet).sort((a, b) => a - b);

  // Build lookup maps for each official:
  // - surveysMap: timestamp -> surveyor
  // - surveyValueMap: timestamp -> survey branch's value
  // - weeklyMap: timestamp -> weekly branch's value
  const officialMaps: Record<
    string,
    {
      surveysMap: Record<number, string | null>;
      surveyValueMap: Record<number, number | null>;
      weeklyMap: Record<number, number | null>;
      marginMap: Record<number, [number, number] | null>;
    }
  > = {};
  officialIds.forEach((id) => {
    const { surveys, ...data } = (approval.data as unknown as Approval["data"])[
      id
    ][type];
    const surveysMap: Record<number, string | null> = {};
    const surveyValueMap: Record<number, number | null> = {};
    const marginMap: Record<number, [number, number] | null> = {};
    if (surveys?.timestamp) {
      for (let i = 0; i < surveys.timestamp.length; i++) {
        surveysMap[surveys.timestamp[i]] = surveys.surveyor[i] || null;
        surveyValueMap[surveys.timestamp[i]] = surveys.value[i] ?? null;
      }
    }
    const weeklyMap: Record<number, number | null> = {};
    if (data[seriesType as unknown as "weekly" | "monthly"]?.timestamp) {
      for (
        let i = 0;
        i <
        data[seriesType as unknown as "weekly" | "monthly"].timestamp.length;
        i++
      ) {
        marginMap[
          data[seriesType as unknown as "weekly" | "monthly"].timestamp[i]
        ] = data[seriesType as unknown as "weekly" | "monthly"].high[i]
          ? [
              data[seriesType as unknown as "weekly" | "monthly"].high[i],
              data[seriesType as unknown as "weekly" | "monthly"].low[i],
            ]
          : null;
        weeklyMap[
          data[seriesType as unknown as "weekly" | "monthly"].timestamp[i]
        ] =
          data[seriesType as unknown as "weekly" | "monthly"].value[i] ?? null;
      }
    }
    officialMaps[id] = {
      surveysMap,
      surveyValueMap,
      weeklyMap,
      marginMap,
    };
  });
  return { allDates, officialMaps };
};
