import useStatisticDateStore from "@/store/statistic-date-store";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function useFacebookTopics() {
  const { to } = useStatisticDateStore();
  const params = useParams();

  return useQuery({
    queryKey: ["facebook", "topics", params.id],
    queryFn: async () => {
      const url = new URL(
        `/api/v1/facebook/${params.id}/topics`,
        window.location.origin
      );
      if (to) {
        // url.searchParams.set("date", format(to, "yyyy-MM-dd"));
        url.searchParams.set("date", "");
      }
      const response = await fetch(url.toString());
      const data: FacebookTopics = await response.json();
      const articles = Object.groupBy(data.nodes, (node) => node.class);
      return { ...data, articles };
    },
  });
}

type FacebookTopics = {
  date: string; // date
  classes: Record<
    number,
    {
      representation: string;
      summary: string;
      topics: string;
      num_contents: number;
      num_domains: number;
      total_engagements: number;
      total_comments: number;
      total_shares: number;
      total_likes: number;
      total_wow: number;
      total_love: number;
      total_haha: number;
      total_sad: number;
      total_angry: number;
    }
  >;
  nodes: {
    class: string;
    id: string;
    domain: string;
    title: string;
    url: string;
    engagement: number;
  }[];
};
