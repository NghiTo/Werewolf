export interface Player {
  id: number;
  name: string;
  roleId: string;
  alive: boolean;
}

export interface NightAction {
  werewolf?: number;
  bodyguard?: number;
  seer?: number;
  hunter?: number;
  spellcaster?: number;
  cupid?: number[];
  "cult-leader"?: number;
  doppelganger?: number;
  hunterState?: number;
  witch?: {
    save?: boolean;
    kill?: number;
  };
}
