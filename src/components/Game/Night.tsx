import { ROLES } from "@/database/role";
import { useGameDataStore } from "@/store/dataStore";
import type { NightAction, Player } from "@/types/interfaces";
import { Card, Image, Select, Typography } from "antd";
import Witch from "./Witch";
import Cursed from "./Cursed";

const { Title, Text } = Typography;

interface NightProps {
  role: Player;
  nightActions: NightAction;
  setNightActions: React.Dispatch<React.SetStateAction<NightAction>>;
}

const Night = ({ role, nightActions, setNightActions }: NightProps) => {
  const { players, turn, doppelgangerState } = useGameDataStore();

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
      case "cupid":
        return "Choose two players to fall in love";
      case "cult-leader":
        return "Choose a player to recruit into the cult";
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
              p.alive && ROLES.find((r) => r.id === p.roleId)?.side !== "wolf",
          )
          .map((p) => ({
            label: `${p.name} (${p.roleId})`,
            value: p.id,
          }));
      case "bodyguard":
      case "cupid":
        return players
          .filter((p) => p.alive)
          .map((p) => ({
            label: `${p.name} (${p.roleId})`,
            value: p.id,
          }));
      case "cult-leader":
        return players
          .filter((p) => p.alive && p.id !== role.id)
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

  const getValueByRole = (roleId: string) => {
    if (roleId === "doppelganger" && turn > 1) {
      return doppelgangerState ?? undefined;
    }

    if (roleId === "cupid") {
      return nightActions.cupid;
    }

    if (roleId === "cult-leader") {
      return nightActions["cult-leader"];
    }

    return undefined;
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
      case "cursed":
        return <Cursed nightActions={nightActions} role={role} />;
      case "cupid":
        return (
          <>
            <Title level={5}>{checkAction(role.roleId)}</Title>
            <Select
              disabled={disableSelect()}
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select two players"
              value={getValueByRole(role.roleId)}
              onChange={(value) => {
                const selected = Array.isArray(value)
                  ? Array.from(new Set(value)).slice(0, 2)
                  : [];
                setNightActions((prev) => ({
                  ...prev,
                  cupid: selected,
                }));
              }}
              options={getOptionsByRole(role.roleId)}
            />
          </>
        );
      default:
        return (
          <>
            <Title level={5}>{checkAction(role.roleId)}</Title>
            <Select
              disabled={disableSelect()}
              style={{ width: "100%" }}
              placeholder="Select a player"
              value={getValueByRole(role.roleId)}
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
