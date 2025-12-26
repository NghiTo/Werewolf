import { ROLES } from "@/database/role";
import { useGameDataStore } from "@/store/dataStore";
import type { NightAction, Player } from "@/types/interfaces";
import { Card, Image, Select, Typography } from "antd";
import { useEffect } from "react";
import Witch from "./Witch";

const { Title, Text } = Typography;

interface NightProps {
  role: Player;
  nightActions: NightAction;
  setNightActions: React.Dispatch<React.SetStateAction<NightAction>>;
}

const Night = ({ role, nightActions, setNightActions }: NightProps) => {
  const { players, setWinner, turn } = useGameDataStore();

  const checkAction = (roleId: string) => {
    switch (roleId) {
      case "werewolf":
        return "Choose target to kill";
      case "bodyguard":
        return "Choose target to protect";
      case "seer":
        return "Choose target to see";
      case "hunter":
        return "Choose target to kill";
      case "spellcaster":
        return "Choose target to be silented";
      case "doppelganger":
        return "Choose target to copy";
    }
  };

  const getOptionsByRole = (roleId: string) => {
    switch (roleId) {
      case "werewolf":
        return players
          .filter(
            (p) =>
              p.alive && ROLES.find((r) => r.id === p.roleId)?.side !== "wolf"
          )
          .map((p) => ({
            label: `${p.name} (${p.roleId})`,
            value: p.id,
          }));
      case "bodyguard":
        return players
          .filter((p) => p.alive)
          .map((p) => ({
            label: `${p.name} (${p.roleId})`,
            value: p.id,
          }));
      default:
        return players
          .filter((p) => p.alive && p.id !== role.id)
          .map((p) => ({
            label: `${p.name} (${p.roleId})`,
            value: p.id,
          }));
    }
  };

  const renderOptions = (roleId: string) => {
    switch (roleId) {
      case "witch":
        return (
          <Witch
            getOptionsByRole={getOptionsByRole}
            nightActions={nightActions}
            role={role}
            setNightActions={setNightActions}
          />
        );
      default:
        return (
          <>
            <Title level={5}>{checkAction(role.roleId)}</Title>
            <Select
              disabled={disableSelect()}
              style={{ width: "100%" }}
              placeholder="Select a player"
              onChange={(value) =>
                setNightActions((prev) => ({
                  ...prev,
                  [role.roleId]: value,
                }))
              }
              options={getOptionsByRole(role.roleId)}
            />
          </>
        );
    }
  };

  const disableSelect = () => {
    if (!role.alive) return true;
    if (role.roleId === "doppelganger" && turn > 1) return true;
    return false;
  };

  useEffect(() => {
    const alivePlayers = players.filter((p) => p.alive);
    const aliveWolves = alivePlayers.filter((p) => p.roleId === "werewolf");
    if (aliveWolves.length === alivePlayers.length - aliveWolves.length - 1) {
      setWinner("WOLF");
    }
  }, []);

  return (
    <Card
      className="mb-3"
      styles={{
        body: { display: "flex", gap: 12, alignItems: "center" },
      }}
    >
      <div className="flex flex-col items-center">
        <Image
          src={ROLES.find((r) => r.id === role.roleId)?.image}
          width={48}
        />
        <Text strong>{role.name}</Text>
      </div>

      <div style={{ flex: 1 }}>{renderOptions(role.roleId)}</div>
    </Card>
  );
};

export default Night;
