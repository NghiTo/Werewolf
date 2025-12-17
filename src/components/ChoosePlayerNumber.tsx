import { Button, Card, InputNumber, Space, Typography } from "antd";
import { UsergroupAddOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useGameStore } from "@/store/gameStore";

const { Title, Text } = Typography;

const ChoosePlayerNumber = () => {
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const setCount = useGameStore((state) => state.setPlayerCount);

  const isValid =
    typeof playerCount === "number" && playerCount >= 4 && playerCount <= 20;

  const handleSubmit = () => {
    if (isValid) {
      setCount(playerCount);
    }
  };

  return (
    <Card
      className="rounded-2xl"
      style={{
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <Space align="start">
          <div
            className="w-10 h-10 rounded-[50%] flex items-center justify-center"
            style={{
              background: "rgba(22, 119, 255, 0.1)",
            }}
          >
            <UsergroupAddOutlined className="text-[#1677ff] text-lg" />
          </div>
          <div>
            <Title level={3} style={{ marginBottom: 0 }}>
              Start a new game
            </Title>
            <Text type="secondary">Configure players before starting</Text>
          </div>
        </Space>

        <div>
          <Text strong>Number of players</Text>
          <div className="mt-2">
            <InputNumber
              value={playerCount}
              onChange={setPlayerCount}
              placeholder="3 – 30"
              style={{width: "100%"}}
              className="h-10"
            />
          </div>
          <div style={{ marginTop: 4 }}>
            {!playerCount && (
              <Text type="secondary" className="text-xs">
                At least 4, maximum 20 players
              </Text>
            )}
            {playerCount && isValid && (
              <Text type="success" className="text-xs">
                Valid player count
              </Text>
            )}
            {playerCount && !isValid && (
              <Text type="danger" className="text-xs">
                Must be between 4 and 20 players
              </Text>
            )}
          </div>
        </div>

        <Button
          type="primary"
          size="large"
          icon={<PlayCircleOutlined />}
          block
          disabled={!isValid}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </Space>
    </Card>
  );
};

export default ChoosePlayerNumber;
