import { subMonths } from "date-fns";
import { create } from "zustand";

type PageConfigState = {
  from?: Date;
  to?: Date;
};

type PageConfigAction = {
  setFrom: (from?: Date) => void;
  setTo: (from?: Date) => void;
};

export const usePageConfigStore = create<PageConfigState & PageConfigAction>(
  (set) => ({
    from: subMonths(new Date(), 1),
    to: new Date(),
    setFrom: (from) => set({ from }),
    setTo: (to) => set({ to }),
  })
);
