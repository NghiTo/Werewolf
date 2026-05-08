import type { NightAction, Player } from "@/types/interfaces";
import { Typography } from "antd";

const { Title } = Typography;

interface CursedProps {
  role: Player;
  nightActions: NightAction;
}

const Cursed = ({ nightActions, role }: CursedProps) => {
  const isBitten =
    nightActions.werewolf === role.id &&
    !nightActions.witch?.save &&
    nightActions.bodyguard !== role.id;

  return (
    <div className="flex flex-col gap-2">
      <Title level={5}>
        Cursed status: {isBitten ? "Werewolf" : "Villager"}
      </Title>
    </div>
  );
};

export default Cursed;
