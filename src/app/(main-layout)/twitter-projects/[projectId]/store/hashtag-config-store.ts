import { create } from "zustand";

type HashtagState = {
  date: Date;
  window: number;
};

type HashtagAction = {
  setDate: (date?: Date) => void;
  setWindow: (value: number) => void;
};

const useHashtagStore = create<HashtagAction & HashtagState>((set) => ({
  window: 3,
  setWindow(value) {
    set({ window: value });
  },
  date: new Date(),
  setDate(date) {
    set({ date });
  },
}));

export default useHashtagStore;
