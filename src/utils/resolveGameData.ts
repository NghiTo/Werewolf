import type { NightAction, Player } from "@/types/interfaces";

export const resolveWolfKill = (
  nightActions: NightAction,
  deadIds: Set<number>
) => {
  const { werewolf, bodyguard, witch } = nightActions;

  if (werewolf && werewolf !== bodyguard && !witch?.save) {
    deadIds.add(werewolf);
  }
};

export const resolveDeaths = (players: Player[], deadIds: Set<number>) =>
  players.map((p) => (deadIds.has(p.id) ? { ...p, alive: false } : p));

export const resolveWitch = (
  nightActions: NightAction,
  deadIds: Set<number>
) => {
  if (nightActions.witch?.kill !== undefined) {
    deadIds.add(nightActions.witch.kill);
  }
};
