import { FacebookClient } from "@/lib/facebook-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const usePage = () => {
  const { id } = useParams();

  return useQuery({
    queryKey: ["page", id],
    queryFn: async () => {
      const { data } = await FacebookClient.get(`/page/${id}`);
      return data;
    },
  });
};
