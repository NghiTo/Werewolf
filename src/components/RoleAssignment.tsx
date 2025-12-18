import { Card, Typography, Input, Button, Image, message } from "antd";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { ROLES } from "@/database/role";
import { useGameDataStore } from "@/store/dataStore";

const { Title, Text } = Typography;

export default function RoleAssignment() {
  const { selectedRoles, playerCount, setStep } = useGameStore();
  const { setPlayers } = useGameDataStore();
  const [assignments, setAssignments] = useState<any[]>([]);

  const buildAssignments = (
    selectedRoles: Record<string, number>,
    rolesMeta: any[]
  ) => {
    const result = [];

    for (const [roleId, count] of Object.entries(selectedRoles)) {
      const meta = rolesMeta.find((r) => r.id === roleId);

      for (let i = 1; i <= count; i++) {
        result.push({
          roleId,
          roleName: meta?.name ?? roleId,
          image: meta?.image,
          index: i,
          playerName: "",
        });
      }
    }

    return result;
  };

  useEffect(() => {
    setAssignments(buildAssignments(selectedRoles, ROLES));
  }, [selectedRoles]);

  const updateName = (index: number, value: string) => {
    setAssignments((prev) =>
      prev.map((a, i) => (i === index ? { ...a, playerName: value } : a))
    );
  };

  const allFilled = assignments.every((a) => a.playerName.trim() !== "");

  const handleStartGame = () => {
    if (!allFilled) return;

    const names = assignments.map((a) => a.playerName.trim());
    if (new Set(names).size !== names.length) {
      return message.error("Player names must be unique");
    }

    const players = assignments.map((a, index) => ({
      id: index + 1,
      name: a.playerName.trim(),
      roleId: a.roleId,
      alive: true,
    }));

    setPlayers(players);
    setStep("IN_GAME");
  };

  return (
    <Card className="mt-6 rounded-2xl">
      <Title level={3}>🎭 Assign roles to players</Title>
      <Text type="secondary">
        {assignments.filter((a) => a.playerName).length} / {playerCount} filled
      </Text>

      <div className="mt-6 max-h-[480px] overflow-y-auto">
        {assignments.map((a, i) => (
          <Card
            key={`${a.roleId}-${i}`}
            style={{ marginBottom: 12 }}
            styles={{
              body: { display: "flex", gap: 12, alignItems: "center" },
            }}
          >
            <Image src={a.image} width={48} preview={false} />

            <div style={{ flex: 1 }}>
              <Text strong>
                {a.roleName}
                {a.index > 1 && ` #${a.index}`}
              </Text>

              <Input
                placeholder="Player name"
                value={a.playerName}
                onChange={(e) => updateName(i, e.target.value)}
                className="mt-1"
              />
            </div>
          </Card>
        ))}
      </div>

      <Button
        type="primary"
        block
        size="large"
        disabled={!allFilled}
        className="mt-1"
        onClick={handleStartGame}
      >
        Start game
      </Button>
    </Card>
  );
}
