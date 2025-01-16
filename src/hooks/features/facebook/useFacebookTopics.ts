import useStatisticDateStore from "@/store/statistic-date-store";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
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
        url.searchParams.set("window", format(subDays(to, 7), "yyyy-MM-dd"));
      }
      const response = await fetch(url.toString());

      const data = await response.json();
      console.log("huhi");
      return data;
    },
  });
}
