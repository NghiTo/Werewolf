import type { Player } from "@/utils/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameDataState {
  players: Player[];
  phase: string;
  winner: string | null;
  witchState: { usedSave: boolean; usedKill: boolean };

  setPlayers: (players: Player[]) => void;
  setWinner: (winners: string | null) => void;
  setPhase: (phase: string) => void;
  setWitchState: (witchState: { usedSave: boolean; usedKill: boolean }) => void;
  resetGameData: () => void;
}

const initialState = {
  players: [],
  phase: "NIGHT",
  winner: null,
  witchState: {
    usedSave: false,
    usedKill: false,
  },
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

      setWitchState: (witchState) => set({ witchState }),

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
