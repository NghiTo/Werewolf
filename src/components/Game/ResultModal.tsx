import { Modal, Typography, Button } from "antd";
import { useGameDataStore } from "@/store/dataStore";
import { useGameStore } from "@/store/gameStore";

const { Title, Text } = Typography;

export default function ResultModal() {
  const { winner, resetGameData } = useGameDataStore();
  const { resetGame } = useGameStore();

  if (!winner) return null;

  const renderTitle = () => {
    switch (winner) {
      case "WOLF":
        return "🐺 Werewolves win!";
      case "VILLAGE":
        return "🏡 Village wins!";
      case "THIRD":
        return "🎭 Third-side player wins!";
      default:
        return "";
    }
  };

  const renderDescription = () => {
    switch (winner) {
      case "WOLF":
        return "The village has fallen into darkness.";
      case "VILLAGE":
        return "All werewolves have been eliminated.";
      case "THIRD":
        return "A lone survivor has achieved their secret goal.";
      default:
        return "";
    }
  };

  return (
    <Modal open footer={null} closable={false} maskClosable={false} centered>
      <div style={{ textAlign: "center", padding: 24 }}>
        <Title level={2}>{renderTitle()}</Title>

        <Text type="secondary">{renderDescription()}</Text>

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
