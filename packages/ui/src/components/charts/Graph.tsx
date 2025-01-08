import {
  Cosmograph,
  CosmographData,
  CosmographProps,
  CosmographRef,
} from "@cosmograph/react";
import { CosmosInputLink, CosmosInputNode } from "@cosmograph/cosmos";
import { useEffect, useRef } from "react";

export type CosmosNode = CosmosInputNode & {
  label: string;
  fill: string;
  size?: number;
  data: any;
};

export type CosmosLink = CosmosInputLink & {
  data: any;
  fill?: string;
};

type Props = {
  linkVisibilityDistanceRange?: [number, number];
  showDynamicLabels?: boolean;
  simulationGravity?: number;
  simulationLinkSpring?: number;
  simulationRepulsion?: number;
  selectedNode?: CosmosNode | null;
  selectedNodes?: CosmosNode[] | null;
  data: CosmographData<CosmosNode, CosmosLink>;
  onClick?:
    | ((
        clickedNode: CosmosNode | undefined,
        index: number | undefined,
        nodePosition: [number, number] | undefined,
        event: MouseEvent
      ) => void)
    | undefined;
} & CosmographProps<CosmosNode, CosmosLink>;

const Graph = ({
  data,
  showDynamicLabels = true,
  linkVisibilityDistanceRange = [90, 90],
  simulationGravity = 0.38,
  simulationLinkSpring = 0.03,
  simulationRepulsion = 0.4,
  linkArrows = false,
  selectedNode,
  selectedNodes,
  nodeLabelAccessor = (node) => `${node.label}`,
  onClick,
  ...props
}: Props) => {
  const ref = useRef<CosmographRef<CosmosNode, CosmosLink> | null>(null);

  useEffect(() => {
    if (selectedNode) {
      ref.current?.selectNode(selectedNode, true);
    } else ref.current?.unselectNodes();
  }, [selectedNode]);

  useEffect(() => {
    if (selectedNodes) {
      ref.current?.selectNodes(selectedNodes);
    } else ref.current?.unselectNodes();
  }, [selectedNodes]);

  return (
    <Cosmograph
      {...props}
      ref={ref}
      nodes={data.nodes}
      links={data.links}
      backgroundColor="#fff"
      hoveredNodeLabelColor={"#fff"}
      nodeColor={(node) => node.fill}
      nodeSize={(node) => (node.size ? node.size * 0.18 : 1)}
      nodeLabelAccessor={nodeLabelAccessor}
      nodeLabelColor={"#fff"}
      showDynamicLabels={showDynamicLabels}
      linkArrows={linkArrows}
      linkColor={(link) => link.fill || "#c7c7c7"}
      linkVisibilityDistanceRange={linkVisibilityDistanceRange}
      linkGreyoutOpacity={0.9}
      simulationGravity={simulationGravity}
      simulationLinkSpring={simulationLinkSpring}
      simulationRepulsion={simulationRepulsion}
      onClick={(clickedNode, index, nodePosition, event) => {
        if (onClick) {
          onClick(clickedNode, index, nodePosition, event);
        }
        if (clickedNode) {
          ref.current?.selectNode(clickedNode, true);
        } else {
          ref.current?.unselectNodes();
        }
      }}
    />
  );
};

export default Graph;
