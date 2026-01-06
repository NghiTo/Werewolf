import type { NightAction, Player } from "@/types/interfaces";
import {
  resolveDeaths,
  resolveHunter,
  resolveWitch,
  resolveWolfKill,
} from "@/utils/resolveGameData";

const useProcessGameData = (
  players: Player[],
  nightActions: NightAction,
  setPlayers: (players: Player[]) => void,
  checkWinCondition: (players: Player[]) => string | null,
  setPhase: (phase: string) => void,
  setWinner: (winner: string | null) => void,
  setWitchState: (witchState: { usedSave: boolean; usedKill: boolean }) => void,
  setNightActions: (nightActions: NightAction) => void,
  witchState: { usedSave: boolean; usedKill: boolean },
  setHunterState: (hunterState: number | null) => void
) => {
  const startDay = () => {
    let updatedPlayers = [...players];
    const deadIds = new Set<number>();

    resolveWolfKill(nightActions, deadIds);
    resolveWitch(nightActions, deadIds);
    resolveHunter(players, nightActions, deadIds);

    updatedPlayers = resolveDeaths(updatedPlayers, deadIds);

    setWitchState({
      usedSave: witchState.usedSave || !!nightActions.witch?.save,
      usedKill: witchState.usedKill || nightActions.witch?.kill !== undefined,
    });
    setHunterState(nightActions.hunter ?? null);

    setPlayers(updatedPlayers);
    setNightActions({});

    const result = checkWinCondition(updatedPlayers);

    if (result) {
      setWinner(result);
      return;
    }

    setPhase("DAY");
  };

  const startNight = () => {
    setPhase("NIGHT");
  };

  return { startDay, startNight };
};

export default useProcessGameData;
