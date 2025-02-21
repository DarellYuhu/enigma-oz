import { useEffect, useRef } from "react";
import { DataSet } from "vis-data/standalone/umd/vis-data";
import {
  Edge,
  Network,
  NetworkEvents,
  Node,
  Options,
} from "vis-network/standalone/umd/vis-network.min";

const defaultOptions = {
  nodes: {
    color: {
      highlight: "#00f2ea",
    },
    opacity: 0.85,
    borderWidth: 0.01,
    font: {
      strokeWidth: 0.01,
    },
  },

  edges: {
    color: {
      inherit: "both",
      opacity: 0.7,
    },
    smooth: false,
    arrows: {
      to: {
        enabled: false,
      },
    },
    width: 1,
  },

  physics: false,

  layout: {
    improvedLayout: true,
    clusterThreshold: 150,
  },

  interaction: {
    hover: false,
    navigationButtons: false,
    keyboard: false,
  },
};

export type VisData<NodeData = unknown, EdgeData = unknown> = {
  nodes: (Node & { data?: NodeData; [key: string]: any })[];
  edges: (Edge & { data?: EdgeData; [key: string]: any })[];
};

interface VisGraphProps {
  type?: "interestNet" | "tagRelation";
  data: {
    nodes: Node[];
    edges?: Edge[];
  };
  options?: Options;
  events?: {
    [key in NetworkEvents]?: (params: any) => void;
  };
  style?: React.CSSProperties;
  minVelocity?: number;
  getNetwork?: (network: Network) => void;
  getNodes?: (nodes: DataSet<Node>) => void;
  getEdges?: (edges: DataSet<Edge>) => void;
}

const VisGraph = ({
  type = "interestNet",
  data,
  options = defaultOptions,
  events = {},
  style = { width: "100%", height: "100%" },
  minVelocity = 3,
  getNetwork,
  getNodes,
  getEdges,
}: VisGraphProps) => {
  const nodes = useRef<any>(null);
  const edges = useRef<any>(null);
  const network = useRef<Network | null>(null);
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    nodes.current = new DataSet(data.nodes);
    edges.current = new DataSet(data.edges ?? []);
    network.current = new Network(
      container.current!,
      { nodes: nodes.current, edges: edges.current },
      options
    );

    network.current.on("afterDrawing", () => {
      if (type === "tagRelation") {
        network.current?.setOptions({
          nodes: {
            // opacity: 0.0,
            borderWidth: 0.1,
          },
          edges: {
            smooth: {
              type: "curvedCCW",
              enabled: true,
              roundness: 0.5,
            },
            color: {
              opacity: 0.2,
            },
            width: 0.8,
          },
          physics: {
            solver: "forceAtlas2Based",
            forceAtlas2Based: {
              damping: 0.6,
              springLength: 80,
            },
            minVelocity,
            stabilization: false,
          },
        });
      } else {
        network.current?.setOptions({
          nodes: {
            opacity: 1,
            borderWidth: 0,
            size: 15,
            font: {
              size: 15,
            },
          },
          edges: {
            width: 1.5,
            smooth: false,
          },
          physics: {
            barnesHut: {
              gravitationalConstant: -16800,
              centralGravity: 0.1,
              springLength: 130,
              springConstant: 1,
              damping: 0.5,
              avoidOverlap: 0.5,
            },
            minVelocity: 0.75,
          },
        });
      }
    });

    if (getNetwork) {
      getNetwork(network.current);
    }

    if (getNodes) {
      getNodes(nodes.current);
    }

    if (getEdges) {
      getEdges(edges.current);
    }

    return () => {
      network.current?.destroy();
    };
  }, [data]);

  useEffect(() => {
    network.current?.setOptions(options);
  }, [options]);

  useEffect(() => {
    // Add user provied events to network
    // eslint-disable-next-line no-restricted-syntax
    for (const eventName of Object.keys(events)) {
      network.current?.on(
        eventName as NetworkEvents,
        (events as any)[eventName]
      );
    }

    return () => {
      for (const eventName of Object.keys(events)) {
        network.current?.off(
          eventName as NetworkEvents,
          (events as any)[eventName]
        );
      }
    };
  }, [events]);

  return <div ref={container} style={style} />;
};

export default VisGraph;
