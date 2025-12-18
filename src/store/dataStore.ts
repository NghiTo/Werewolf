import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Player {
  id: number;
  name: string;
  roleId: string;
  alive: boolean;
}

interface GameDataState {
  players: Player[];
  phase: string;
  winner: string | null;

  setPlayers: (players: Player[]) => void;
  setWinner: (winners: string | null) => void;
  setPhase: (phase: string) => void;
  resetGameData: () => void;
}

const initialState = {
  players: [],
  phase: "NIGHT",
  winner: null,
};

export const useGameDataStore = create<GameDataState>()(
  persist(
    (set) => ({
      ...initialState,

      setPlayers: (players) =>
        set({
          players,
        }),

      setPhase: (phase) => set({ phase }),

      setWinner: (winner) => set({ winner }),

      resetGameData: () => {
        set({ ...initialState });
        localStorage.removeItem("werewolf-game-data");
      },
    }),
    {
      name: "werewolf-game-data",
      version: 1,

      partialize: (state) => ({
        players: state.players,
        phase: state.phase,
        winner: state.winner,
      }),
    }
  )
);
