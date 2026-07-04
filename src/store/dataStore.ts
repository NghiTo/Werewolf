import type { Player } from "@/types/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameDataState {
  players: Player[];
  phase: string;
  winner: string | null;
  turn: number;
  witchState: { usedSave: boolean; usedKill: boolean };
  doppelgangerState: number | null;
  hunterState: number | null;
  cultMembers: number[];
  cupidPair: number[] | null;

  setPlayers: (players: Player[]) => void;
  setWinner: (winners: string | null) => void;
  setPhase: (phase: string) => void;
  setTurn: (turn: number) => void;
  setDoppelgangerState: (doppelgangerState: number | null) => void;
  setHunterState: (hunterState: number | null) => void;
  setCultMembers: (cultMembers: number[]) => void;
  setCupidPair: (cupidPair: number[] | null) => void;
  setWitchState: (witchState: { usedSave: boolean; usedKill: boolean }) => void;
  resetGameData: () => void;
}

const initialState = {
  players: [],
  phase: "NIGHT",
  winner: null,
  turn: 1,
  doppelgangerState: null,
  hunterState: null,
  cultMembers: [],
  cupidPair: null,
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

      setTurn: (turn) => set({ turn }),

      setDoppelgangerState: (doppelgangerState: number | null) => set({ doppelgangerState }),

      setHunterState: (hunterState: number | null) => set({ hunterState }),

      setCultMembers: (cultMembers: number[]) => set({ cultMembers }),

      setCupidPair: (cupidPair: number[] | null) => set({ cupidPair }),

      setWitchState: (witchState: { usedSave: boolean; usedKill: boolean }) => set({ witchState }),

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
        turn: state.turn,
        hunterState: state.hunterState,
        doppelgangerState: state.doppelgangerState,
        cultMembers: state.cultMembers,
        cupidPair: state.cupidPair,
        witchState: state.witchState,
      }),
    }
  )
);
