import { GraphEdge, GraphNode } from "reagraph";
import { Edge, Node } from "vis-network/peer/esm/vis-network";

const colors = [
  "#527BA8",
  "#EE8C1F",
  "#DD5657",
  "#7AB7B2",
  "#60A04E",
  "#ECC640",
  "#AD7BA2",
  "#FB9CA6",
  "#9B755F",
  "#B9AFAB",
];

const normalizeInterestNetwork = (data: InterestNetwork) => {
  // const edges: GraphEdge[] = data.network.edges.map((edge, index) => ({
  //   ...edge,
  //   id: index.toString(),
  //   source: edge.from,
  //   target: edge.to,
  // }));
  // const nodes: GraphNode[] = data.network.nodes.map((node) => ({
  //   ...node,
  //   label: node.author_name,
  //   size: Math.log(node.digg) * 2,
  //   fill: colors[node.class],
  // }));
  const edges: Edge[] = data.network.edges;
  const nodes: Node[] = data.network.nodes.map((node) => ({
    ...node,
    label: node.author_name,
    shape: "dot",
    size: Math.log(node.digg),
    color: colors[node.class],
    font: { size: Math.log(node.play) },
  }));

  console.log({ edges, nodes });
  return { edges, nodes };
};

export default normalizeInterestNetwork;
