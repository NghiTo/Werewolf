import type { NightAction, Player } from "@/types/interfaces";

export const resolveDeaths = (players: Player[], deadIds: Set<number>) =>
  players.map((p) => (deadIds.has(p.id) ? { ...p, alive: false } : p));

export const resolveWolfKill = (
  nightActions: NightAction,
  deadIds: Set<number>
) => {
  const { werewolf, bodyguard, witch } = nightActions;

  if (werewolf && werewolf !== bodyguard && !witch?.save) {
    deadIds.add(werewolf);
  }
};

export const resolveWitch = (
  nightActions: NightAction,
  deadIds: Set<number>
) => {
  if (nightActions.witch?.kill !== undefined) {
    deadIds.add(nightActions.witch.kill);
  }
};

export const resolveHunter = (
  players: Player[],
  nightActions: NightAction,
  deadIds: Set<number>
) => {
  const hunter = players.find((p) => p.roleId === "hunter" && p.alive);

  if (!hunter) return;

  if (!deadIds.has(hunter.id)) return;

  const targetId = nightActions.hunter;

  if (targetId === undefined) return;

  if (targetId === hunter.id) return;

  deadIds.add(targetId);
};

export const resolveDoppelganger = (
  players: Player[],
  nightActions: NightAction,
  deadIds: Set<number>
) => {
  const doppelganger = players.find((p) => p.roleId === "doppelganger" && p.alive);

  if (!doppelganger) return players;

  const targetId = nightActions.doppelganger;

  if (targetId === undefined) return players;

  if (deadIds.has(targetId)) {
    const target = players.find((p) => p.id === targetId);
    if (target) {
      return players.map((p) =>
        p.id === doppelganger.id ? { ...p, roleId: target.roleId } : p
      );
    }
  }

  return players;
};
