import { Modal, Typography, Button } from "antd";
import { useGameDataStore } from "@/store/dataStore";
import { useGameStore } from "@/store/gameStore";

const { Title, Text } = Typography;

export default function ResultModal() {
  const { winner, resetGameData } = useGameDataStore();
  const { resetGame } = useGameStore();

  if (!winner) return null;

  return (
    <Modal open footer={null} closable={false} maskClosable={false} centered>
      <div style={{ textAlign: "center", padding: 24 }}>
        <Title level={2}>
          {winner === "WOLF" ? "🐺 Werewolves win!" : "🏡 Village wins!"}
        </Title>

        <Text type="secondary">
          {winner === "WOLF"
            ? "The village has fallen into darkness."
            : "All werewolves have been eliminated."}
        </Text>

        <Button
          type="primary"
          size="large"
          block
          style={{ marginTop: 24 }}
          onClick={() => {
            resetGameData();
            resetGame();
          }}
        >
          Start new game
        </Button>
      </div>
    </Modal>
  );
}
