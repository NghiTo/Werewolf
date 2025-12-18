import { ROLES } from "@/database/role";
import { useGameDataStore, type Player } from "@/store/dataStore";
import { Card, Image, Select, Typography } from "antd";

const { Title, Text } = Typography;

interface NightProps {
  role: Player;
  wolfTarget: number | null;
  setWolfTarget: React.Dispatch<React.SetStateAction<number | null>>;
}

const Night = ({ role, wolfTarget, setWolfTarget }: NightProps) => {
  const { players } = useGameDataStore();
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
        <Title level={5}>Choose target to kill</Title>
        <Select
          style={{ width: "100%" }}
          placeholder="Select a player"
          value={wolfTarget}
          onChange={(value) => setWolfTarget(value)}
          options={players
            .filter(
              (p) =>
                p.alive && ROLES.find((r) => r.id === p.roleId)?.side !== "wolf"
            )
            .map((p) => ({
              label: `${p.name} (${p.roleId})`,
              value: p.id,
            }))}
        />
      </div>
    </Card>
  );
};

export default Night;
