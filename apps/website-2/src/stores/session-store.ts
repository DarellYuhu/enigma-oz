import { createStore } from "zustand";
import { persist } from "zustand/middleware";

type SessionState = {
  token?: string;
  user?: {
    id: string;
    username: string;
    displayName: string;
    role: string;
  };
};

type SessionAction = {
  setToken: (token: SessionState["token"]) => void;
  setUser: (token: SessionState["user"]) => void;
};

export const useSessionStore = createStore<SessionState & SessionAction>()(
  persist(
    (set) => ({
      token: undefined,
      user: undefined,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "session",
    }
  )
);
