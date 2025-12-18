import { Button, Typography } from "antd";
import { LogoutOutlined, UndoOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/store/authStore";
import ChoosePlayerNumber from "./ChoosePlayerNumber";
import { useGameStore } from "@/store/gameStore";
import RoleSelection from "./RoleSelection";
import RoleAssignment from "./RoleAssignment";
import Game from "./Game/Game";
import { useGameDataStore } from "@/store/dataStore";

const { Title, Text } = Typography;

export default function DashBoard() {
  const { logout } = useAuthStore();
  const { step, resetGame } = useGameStore();
  const { resetGameData } = useGameDataStore();

  const handleResetGame = () => {
    resetGameData();
    resetGame();
  }

  const handleLogout = () => {
    resetGameData()
    resetGame();
    logout();
  };

  return (
    <main
      className="min-h-screen p-6"
      style={{
        background:
          "linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #fafafa 100%)",
      }}
    >
      <div className="max-w-[480px] m-auto">
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Title level={1} className="mb-2">
            🐺 Werewolf
          </Title>
          <Text type="secondary">Game master dashboard</Text>
        </div>

        <div className="flex justify-end mb-4">
          {step !== "PLAYER_COUNT" && (
            <Button type="text" icon={<UndoOutlined />} onClick={handleResetGame}>
              Reset game
            </Button>
          )}
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            Log out
          </Button>
        </div>
        {step === "PLAYER_COUNT" && <ChoosePlayerNumber />}

        {step === "ROLE_SELECTION" && <RoleSelection />}

        {step === "ROLE_ASSIGNMENT" && <RoleAssignment />}

        {step === "IN_GAME" && <Game />}

        <Text type="secondary" className="block text-center mt-6 text-xs">
          Tip: Ideal games work best with 6–12 players
        </Text>
      </div>
    </main>
  );
}
