import type { NightAction, Player } from "@/types/interfaces";

export const resolveDeaths = (players: Player[], deadIds: Set<number>) =>
  players.map((p) => (deadIds.has(p.id) ? { ...p, alive: false } : p));

export const resolveWolfKill = (
  nightActions: NightAction,
  deadIds: Set<number>,
) => {
  const { werewolf, bodyguard, witch } = nightActions;

  if (werewolf && werewolf !== bodyguard && !witch?.save) {
    deadIds.add(werewolf);
  }
};

export const resolveWitch = (
  nightActions: NightAction,
  deadIds: Set<number>,
) => {
  if (nightActions.witch?.kill !== undefined) {
    deadIds.add(nightActions.witch.kill);
  }
};

export const resolveHunter = (
  players: Player[],
  nightActions: NightAction,
  deadIds: Set<number>,
) => {
  const hunter = players.find((p) => p.roleId === "hunter" && p.alive);

  if (!hunter) return;

  if (!deadIds.has(hunter.id)) return;

  const targetId = nightActions.hunter;

  if (targetId === undefined) return;

  if (targetId === hunter.id) return;

  deadIds.add(targetId);
};

export const resolveCupid = (
  deadIds: Set<number>,
  cupidPair: number[] | null,
) => {
  if (!cupidPair || cupidPair.length !== 2) return;

  const [first, second] = cupidPair;

  if (deadIds.has(first)) {
    deadIds.add(second);
  }

  if (deadIds.has(second)) {
    deadIds.add(first);
  }
};

export const resolveCultLeader = (
  players: Player[],
  nightActions: NightAction,
  cultMembers: number[],
) => {
  const leader = players.find((p) => p.roleId === "cult-leader" && p.alive);
  if (!leader) return cultMembers;

  const newMembers = new Set(cultMembers ?? []);
  newMembers.add(leader.id);

  const targetId = nightActions["cult-leader"];
  if (targetId !== undefined) {
    const target = players.find((p) => p.id === targetId && p.alive);
    if (target) {
      newMembers.add(targetId);
    }
  }

  return Array.from(newMembers);
};

export const resolveDoppelganger = (
  players: Player[],
  nightActions: NightAction,
  deadIds: Set<number>,
  doppelgangerState: number | null,
) => {
  const doppelganger = players.find(
    (p) => p.roleId === "doppelganger" && p.alive,
  );

  if (!doppelganger) return players;

  const targetId = nightActions.doppelganger || doppelgangerState;

  if (targetId === undefined || targetId === null) return players;

  if (deadIds.has(targetId)) {
    const target = players.find((p) => p.id === targetId);
    if (target) {
      return players.map((p) =>
        p.id === doppelganger.id ? { ...p, roleId: target.roleId } : p,
      );
    }
  }

  return players;
};

export const resolveCursed = (players: Player[], deadIds: Set<number>) => {
  const cursed = players.find((p) => p.roleId === "cursed" && p.alive);

  if (!cursed) return players;

  if (deadIds.has(cursed.id)) {
    deadIds.delete(cursed.id);
    return players.map((p) =>
      p.id === cursed.id ? { ...p, roleId: "werewolf" } : p,
    );
  }

  return players;
};
