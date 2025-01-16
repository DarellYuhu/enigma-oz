import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const useFacebookProjects = () => {
  return useQuery({
    queryKey: ["facebook"],
    queryFn: async () => {
      const response = await fetch("/api/v1/facebook");
      const data: FacebookProjects = await response.json();
      const normalized = {
        projects: data.projects.map((item) => ({
          ...item,
          created: format(new Date(item.created), "dd MMMM yyyy"),
          lastUpdate: format(new Date(item.lastUpdate), "dd MMMM yyyy"),
        })),
      };
      return normalized;
    },
  });
};

export default useFacebookProjects;

export type FacebookProjects = {
  projects: {
    projectId: string;
    projectName: string;
    status: string;
    created: string | Date; //date
    lastUpdate: string | Date; //date
  }[];
};
