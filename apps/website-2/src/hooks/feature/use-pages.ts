import { FacebookClient } from "@/lib/facebook-client";
import { useQuery } from "@tanstack/react-query";

export const usePages = () => {
  return useQuery({
    queryKey: ["pages"],
    queryFn: async (): Promise<PageData> => {
      const { data } = await FacebookClient.get("/page");
      return data;
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
  };
  statusCode: number;
};
