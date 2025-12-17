import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Role {
  id: string;
  name: string;
  image: string;
}

export type GameStep =
  | "PLAYER_COUNT"
  | "ROLE_SELECTION"
  | "ROLE_ASSIGNMENT"
  | "IN_GAME";

interface GameState {
  // state
  step: GameStep;
  playerCount: number;
  selectedRoles: Record<string, number>;

  // actions
  setStep: (step: GameStep) => void;
  setPlayerCount: (count: number) => void;
  setSelectedRoles: (roles: Record<string, number>) => void;
  resetGame: () => void;
}

const initialState = {
  step: "PLAYER_COUNT" as GameStep,
  playerCount: 0,
  selectedRoles: {},
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ step }),

      setPlayerCount: (count) =>
        set({
          playerCount: count,
          step: "ROLE_SELECTION",
          selectedRoles: {},
        }),

      setSelectedRoles: (roles) =>
        set({
          selectedRoles: roles,
          step: "ROLE_ASSIGNMENT",
        }),

      resetGame: () => {
        set({ ...initialState });
        localStorage.removeItem("werewolf-game");
      },
    }),
    {
      name: "werewolf-game",
      version: 1,

      partialize: (state) => ({
        step: state.step,
        playerCount: state.playerCount,
        selectedRoles: state.selectedRoles,
      }),
    }
  )
);
