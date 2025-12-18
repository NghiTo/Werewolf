import { ROLES } from "@/database/role";
import { useGameDataStore } from "@/store/dataStore";
import type { NightAction, Player } from "@/utils/interfaces";
import { Card, Checkbox, Image, Select, Typography } from "antd";

const { Title, Text } = Typography;

interface NightProps {
  role: Player;
  nightActions: NightAction;
  setNightActions: React.Dispatch<React.SetStateAction<NightAction>>;
}

const Night = ({ role, nightActions, setNightActions }: NightProps) => {
  const { players, witchState } = useGameDataStore();

  const checkAction = (roleId: string) => {
    switch (roleId) {
      case "werewolf":
        return "Choose target to kill";
      case "bodyguard":
        return "Choose target to protect";
      case "seer":
        return "Choose target to see";
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

      <div style={{ flex: 1 }}>
        {role.roleId === "witch" ? (
          <div className="flex flex-col gap-2">
            <Checkbox
              disabled={!role.alive || witchState.usedSave}
              checked={nightActions.witch?.save}
              onChange={(e) =>
                setNightActions((prev) => ({
                  ...prev,
                  witch: {
                    ...prev.witch,
                    save: e.target.checked,
                  },
                }))
              }
            >
              Use rescue potion
            </Checkbox>

            <Select
              allowClear
              disabled={!role.alive || witchState.usedKill}
              placeholder="Choose someone to poison"
              style={{ width: "100%" }}
              value={nightActions.witch?.kill}
              onChange={(value) =>
                setNightActions((prev) => ({
                  ...prev,
                  witch: {
                    ...prev.witch,
                    kill: value,
                  },
                }))
              }
              options={getOptionsByRole(role.roleId)}
            />
          </div>
        ) : (
          <>
            <Title level={5}>{checkAction(role.roleId)}</Title>
            <Select
              disabled={!role.alive}
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
        )}
      </div>
    </Card>
  );
};

export default Night;
