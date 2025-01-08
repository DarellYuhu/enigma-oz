import { FacebookClient } from "@/lib/facebook-client";
import { useQuery } from "@tanstack/react-query";

export const usePages = () => {
  return useQuery({
    queryKey: ["pages"],
    queryFn: async (): Promise<PageData["data"]> => {
      const { data }: { data: PageData } = await FacebookClient.get("/page");
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
