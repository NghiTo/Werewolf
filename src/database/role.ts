import bodyguardImage from "@/assets/bodyguard.webp";
import cultLeaderImage from "@/assets/cult-leader.webp";
import cupidImage from "@/assets/cupid.png";
import cursedImage from "@/assets/cursed.webp";
import direWolfImage from "@/assets/dire-wolf.webp";
import doppelgangerImage from "@/assets/doppelganger.webp";
import hunterImage from "@/assets/hunter.webp";
import seerImage from "@/assets/seer.png";
import spellcasterImage from "@/assets/spellcaster.webp";
import tannerImage from "@/assets/tanner.webp";
import traitorImage from "@/assets/traitor.webp";
import villagerImage from "@/assets/villager.webp";
import werewolfImage from "@/assets/werewolf.webp";
import witchImage from "@/assets/witch.webp";

export const ROLES = [
  {
    id: "werewolf",
    name: "Werewolf",
    image: werewolfImage,
    multi: true,
    side: "wolf",
  },
  {
    id: "villager",
    name: "Villager",
    image: villagerImage,
    multi: true,
    side: "village",
  },
  {
    id: "bodyguard",
    name: "Bodyguard",
    image: bodyguardImage,
    side: "village",
  },
  {
    id: "seer",
    name: "Seer",
    image: seerImage,
    side: "village",
  },
  {
    id: "witch",
    name: "Witch",
    image: witchImage,
    side: "village",
  },
  {
    id: "hunter",
    name: "Hunter",
    image: hunterImage,
    side: "village",
  },
  {
    id: "spellcaster",
    name: "Spellcaster",
    image: spellcasterImage,
    side: "village",
  },
  {
    id: "doppelganger",
    name: "Doppelganger",
    image: doppelgangerImage,
    side: "village",
  },
  {
    id: "traitor",
    name: "Traitor",
    image: traitorImage,
    side: "wolf",
  },
  {
    id: "cursed",
    name: "Cursed",
    image: cursedImage,
    side: "village",
  },
  {
    id: "dire-wolf",
    name: "Dire wolf",
    image: direWolfImage,
    side: "wolf",
  },
  {
    id: "cult-leader",
    name: "Cult leader",
    image: cultLeaderImage,
    side: "third",
  },
  {
    id: "tanner",
    name: "Tanner",
    image: tannerImage,
    side: "third",
  },
  {
    id: "cupid",
    name: "Cupid",
    image: cupidImage,
    side: "village",
  },
];

export const ROLE_ORDER = [
  "cupid",
  "seer",
  "dire-wolf",
  "werewolf",
  "witch",
  "bodyguard",
  "hunter",
  "spellcaster",
  "doppelganger",
  "cursed",
  "cult-leader",
];
