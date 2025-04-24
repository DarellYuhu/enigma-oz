import { CYBERTRON_COLORS } from "@/constants";
import useStatisticDateStore from "@/store/statistic-date-store";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useParams } from "next/navigation";

export default function useFacebookStatistics() {
  const { from, to } = useStatisticDateStore();
  const params = useParams();

  return useQuery({
    queryKey: [
      "facebook",
      "statistics",
      params.id,
      {
        from: format(from!, "yyyy-MM-dd"),
        to: format(to!, "yyyy-MM-dd"),
      },
    ],
    queryFn: async () => {
      const url = new URL(
        `/api/v1/facebook/${params.id}/statistics`,
        window.location.origin
      );
      if (from) url.searchParams.set("since", format(from, "yyyy-MM-dd"));
      if (to) url.searchParams.set("until", format(to, "yyyy-MM-dd"));
      const response = await fetch(url.toString());
      const data: FacebookStatistics = await response.json();

      const normalize = {
        ts: Object.fromEntries(
          Object.keys(data.ts).map((scale) => [
            scale,
            data.ts[scale as "daily" | "weekly" | "monthly"].date.map(
              (date, index) => ({
                date,
                num_articles:
                  data.ts[scale as "daily" | "weekly" | "monthly"].num_articles[
                    index
                  ],
                engagements:
                  data.ts[scale as "daily" | "weekly" | "monthly"].engagements[
                    index
                  ],
              })
            ),
          ])
        ),
        reactions: Object.fromEntries(
          data.reactions.name.map((name, index) => [
            name,
            data.reactions.value[index],
          ])
        ),
        top_domains: data.top_domains.name.map((name, index) => ({
          name,
          value: data.top_domains.value[index],
          fill: CYBERTRON_COLORS[index % CYBERTRON_COLORS.length],
          // fill: chroma.random().alpha(0.7).hex(),
        })),
      };

      return normalize;
    },
  });
}

type FacebookStatistics = {
  ts: Record<
    "daily" | "weekly" | "monthly",
    {
      date: string[];
      num_articles: number[];
      engagements: number[];
    }
  >;
  reactions: {
    name: string[]; // ["Haha", "Love", "Angry", "Wow", "Sad"];
    value: number[]; // [88.5, 8, 2.5, 1, 0];
  };
  top_domains: {
    name: string[];
    value: number[];
  };
};
