import type { NightAction, Player } from "@/types/interfaces";
import {
  resolveDeaths,
  resolveHunter,
  resolveWitch,
  resolveWolfKill,
  resolveDoppelganger,
  resolveCursed,
  resolveCupid,
  resolveCultLeader,
} from "@/utils/resolveGameData";

const useProcessGameData = (
  players: Player[],
  nightActions: NightAction,
  setPlayers: (players: Player[]) => void,
  checkWinCondition: (players: Player[], currentCultMembers?: number[]) => string | null,
  setPhase: (phase: string) => void,
  setWinner: (winner: string | null) => void,
  setWitchState: (witchState: { usedSave: boolean; usedKill: boolean }) => void,
  setNightActions: (nightActions: NightAction) => void,
  witchState: { usedSave: boolean; usedKill: boolean },
  setHunterState: (hunterState: number | null) => void,
  setDoppelgangerState: (doppelgangerState: number | null) => void,
  doppelgangerState: number | null,
  setCultMembers: (cultMembers: number[]) => void,
  cultMembers: number[],
  setCupidPair: (cupidPair: number[] | null) => void,
  cupidPair: number[] | null,
) => {
  const startDay = () => {
    let updatedPlayers = [...players];
    const deadIds = new Set<number>();

    const currentCupidPair =
      nightActions.cupid?.length === 2 ? nightActions.cupid : cupidPair;

    resolveWolfKill(nightActions, deadIds);
    resolveWitch(nightActions, deadIds);
    resolveHunter(players, nightActions, deadIds);
    resolveCupid(deadIds, currentCupidPair);

    const updatedCultMembers = resolveCultLeader(
      players,
      nightActions,
      cultMembers,
    );

    updatedPlayers = resolveCursed(updatedPlayers, deadIds);
    updatedPlayers = resolveDeaths(updatedPlayers, deadIds);
    updatedPlayers = resolveDoppelganger(updatedPlayers, nightActions, deadIds, doppelgangerState);

    setWitchState({
      usedSave: witchState.usedSave || !!nightActions.witch?.save,
      usedKill: witchState.usedKill || nightActions.witch?.kill !== undefined,
    });
    setHunterState(nightActions.hunter ?? null);
    setDoppelgangerState(nightActions.doppelganger ?? null);
    setCultMembers(updatedCultMembers);

    if (nightActions.cupid?.length === 2) {
      setCupidPair(nightActions.cupid);
    }

    if (cupidPair?.length === 2 && (deadIds.has(cupidPair[0]) || deadIds.has(cupidPair[1]))) {
      setCupidPair(null);
    }

    setPlayers(updatedPlayers);
    setNightActions({});

    const result = checkWinCondition(updatedPlayers, updatedCultMembers);

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
