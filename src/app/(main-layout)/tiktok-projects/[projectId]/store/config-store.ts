import { CosmosNode } from "@/components/charts/Graph";
import { create } from "zustand";

type ConfigState = {
  selectedNodes: CosmosNode[] | null;
  window: number;
};

type ConfigAction = {
  setSelectedNodes: (selectedNodes: CosmosNode[] | null) => void;
  setWindow: (value: number) => void;
};

export const useConfigStore = create<ConfigState & ConfigAction>((set) => ({
  window: 3,
  selectedNodes: null,
  setSelectedNodes(nodes) {
    set({ selectedNodes: nodes });
  },
  setWindow(value) {
    set({ window: value });
  },
}));
