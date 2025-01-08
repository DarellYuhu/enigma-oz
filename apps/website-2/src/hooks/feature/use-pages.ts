import { FacebookClient } from "@/lib/facebook-client";
import { usePageConfigStore } from "@/stores/page-config-store";
import { useQuery } from "@tanstack/react-query";

export const usePages = () => {
  const { from, to } = usePageConfigStore();

  return useQuery({
    queryKey: ["pages"],
    queryFn: async (): Promise<PageData["data"]> => {
      const searchParams = new URLSearchParams();
      if (from && to)
        searchParams.set(
          "date",
          [from.toISOString(), to.toISOString()].join(",")
        );
      const { data }: { data: PageData } = await FacebookClient.get(
        "/page?" + searchParams.toString()
      );
      return data.data;
    },
  });
};

export type PageData = {
  data: {
    pages: {
      id: "string";
      name: "string";
      isActive: boolean;
    }[];
    metrics: Record<string, number>;
    timeSeries: Record<string, { end_time: string; value: number }[]>;
  };
  statusCode: number;
};
