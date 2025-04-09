import { CosmosLink, CosmosNode } from "@/components/charts/Graph";
import { COLORS } from "@/constants";
import { CosmographData } from "@cosmograph/react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export function useTiktokInterestNet(payload: {
  params: { projectId: string };
  graphDate: { from?: Date; to?: Date };
  graphQuery: string;
}) {
  return useQuery({
    queryKey: [
      "trends",
      "graphs",
      "interestNet",
      {
        projectId: payload.params.projectId,
        from:
          payload.graphDate.from &&
          format(payload.graphDate.from, "yyyy-MM-dd"),
        to: payload.graphDate.to && format(payload.graphDate.to, "yyyy-MM-dd"),
        search: payload.graphQuery,
      },
    ],
    queryFn: async () => {
      const response = await fetch("/api/v1/project/graphs/interest-network", {
        method: "POST",
        body: JSON.stringify({
          project: payload.params.projectId,
          since: format(payload.graphDate.from!, "yyyy-MM-dd"),
          until: format(payload.graphDate.to!, "yyyy-MM-dd"),
          string: payload.graphQuery,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: InterestNetwork = await response.json();
      const hashtags = Object.values(data.hashtags).map((item, index) => {
        return {
          color: COLORS[index],
          data: item.hashtags.map((tag, index) => ({
            hashtag: tag,
            value: item.values[index],
            color: COLORS[index],
          })),
        };
      });
      const nodes = data.network.nodes.map((node) => ({
        id: node.id,
        label: node.author_name,
        fill: COLORS[node.class],
        size: Math.log(node.digg),
        data: node,
      }));

      const normalized: CosmographData<CosmosNode, CosmosLink> = {
        nodes,
        links: data.network.edges.map((edge, index) => ({
          id: index.toString(),
          source: edge.from,
          target: edge.to,
          fill: nodes.find((node) => node.id === edge.from)?.fill,
          data: edge,
        })),
      };

      return { network: normalized, hashtags, data };
    },
  });
}
