import { ROLES } from "@/database/role";
import { useGameStore } from "@/store/gameStore";
import { Card, Button, Typography, Row, Col, Image, Tabs, message } from "antd";
import { useState } from "react";

const { Title, Text } = Typography;

interface Role {
  id: string;
  name: string;
  image: string;
  multi?: boolean;
}

export default function RoleSelection() {
  const [selectedRoles, setSelectedRoles] = useState<Record<string, number>>(
    {}
  );
  const [activeTab, setActiveTab] = useState<"village" | "wolf" | "third">(
    "village"
  );
  const { playerCount, setSelectedRoles: setRoles } = useGameStore();

  const totalSelected = Object.values(selectedRoles).reduce((a, b) => a + b, 0);
  const visibleRoles = ROLES.filter((r) => r.side === activeTab);

  const getMaxWerewolf = (players: number) => {
    if (players <= 7) return 1;
    if (players <= 9) return 2;
    if (players <= 13) return 3;
    if (players <= 17) return 4;
    return 5; // 18–20
  };

  const increaseRole = (role: Role) => {
    setSelectedRoles((prev) => {
      if (totalSelected >= playerCount) return prev;

      const current = prev[role.id] ?? 0;

      if (!role.multi && current >= 1) return prev;

      if (role.id === "werewolf") {
        const maxWolf = getMaxWerewolf(playerCount);
        if (current >= maxWolf) return prev;
      }

      return { ...prev, [role.id]: current + 1 };
    });
  };

  const decreaseRole = (role: Role) => {
    setSelectedRoles((prev) => {
      const current = prev[role.id] ?? 0;
      if (current <= 0) return prev;

      const next = { ...prev, [role.id]: current - 1 };
      if (next[role.id] === 0) delete next[role.id];
      return next;
    });
  };

  const handleConfirm = () => {
    const hasWolf = Object.entries(selectedRoles).some(
      ([roleId, count]) => roleId === "werewolf" && count > 0
    );

    const hasVillager = Object.entries(selectedRoles).some(
      ([roleId, count]) => roleId !== "werewolf" && count > 0
    );

    if (!hasWolf) {
      return message.error("Game must have at least 1 Werewolf");
    }

    if (!hasVillager) {
      return message.error("Game must have at least 1 Villager-side role");
    }

    setRoles(selectedRoles)
  };

  return (
    <Card
      className="mt-6 rounded-2xl"
      style={{
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <Title level={3}>Select roles</Title>
      <Text type="secondary">
        Selected {totalSelected} / {playerCount} roles
      </Text>

      <Tabs
        defaultActiveKey="village"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as any)}
        centered
        items={[
          {
            key: "village",
            label: "🏠 Village",
          },
          {
            key: "wolf",
            label: "🐺 Wolf",
          },
          {
            key: "third",
            label: "🌓 Third side",
          },
        ]}
        tabBarStyle={{ display: "flex" }}
        tabBarGutter={60}
        className="mt-4"
      />

      <div className="overflow-y-auto pr-2 max-h-[400px]">
        <Row gutter={[16, 16]} className="mt-2">
          {visibleRoles.map((role) => {
            const count = selectedRoles[role.id] ?? 0;
            return (
              <Col xs={12} sm={8} md={6} key={role.id}>
                <Card
                  className="cursor-pointer text-center p-3"
                  style={{
                    border: count > 0 ? "2px solid #1677ff" : undefined,
                  }}
                >
                  <div className="flex flex-col">
                    <Image
                      src={role.image}
                      alt={role.name}
                      height={80}
                      className="object-contain mb-2"
                    />
                    <Text strong>{role.name}</Text>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 8,
                        marginTop: 8,
                      }}
                    >
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          decreaseRole(role);
                        }}
                      >
                        −
                      </Button>
                      <Text className="min-w-4 text-center">{count}</Text>
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          increaseRole(role);
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>

      <Button
        type="primary"
        size="large"
        block
        className="mt-6"
        disabled={totalSelected !== playerCount}
        onClick={handleConfirm}
      >
        Confirm roles
      </Button>
    </Card>
  );
}
