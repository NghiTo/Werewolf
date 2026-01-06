import { Card, Typography, Row, Col, Avatar, Tag, Modal, Button } from "antd";
import { useGameDataStore } from "@/store/dataStore";
import { ROLES } from "@/database/role";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface DayProps {
  checkWinCondition: (players: any) => string | null;
  hasVoted: boolean;
  setHasVoted: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Day({
  checkWinCondition,
  hasVoted,
  setHasVoted,
}: DayProps) {
  const {
    players,
    setPlayers,
    setWinner,
    setTurn,
    turn,
    doppelgangerState,
    hunterState,
  } = useGameDataStore();

  const alivePlayers = players.filter((p) => p.alive);
  const deadPlayers = players.filter((p) => !p.alive);

  const getRoleMeta = (roleId: string) => ROLES.find((r) => r.id === roleId);

  const handleVoteKill = (playerId: number, playerName: string) => {
    Modal.confirm({
      title: "Confirm execution",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure to execute ${playerName}?`,
      okText: "Execute",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: () => {
        const targetRole = players.find((p) => p.id === playerId)?.roleId;
        const doppelganger = players.find(
          (p) => p.roleId === "doppelganger" && p.alive
        );
        const hunter = players.find((p) => p.roleId === "hunter" && p.alive);
        if (targetRole === "tanner") {
          setWinner("THIRD");
          return;
        }

        let updatedPlayers = [...players];

        if (hunter && playerId === hunter.id) {
          updatedPlayers = updatedPlayers.map((p) =>
            p.id === hunterState ? { ...p, alive: false } : p
          );
        }

        if (doppelganger && playerId === doppelgangerState && targetRole) {
          updatedPlayers = updatedPlayers.map((p) =>
            p.id === doppelganger.id ? { ...p, roleId: targetRole } : p
          );
        }

        updatedPlayers = updatedPlayers.map((p) =>
          p.id === playerId ? { ...p, alive: false } : p
        );

        setPlayers(updatedPlayers);

        const result = checkWinCondition(updatedPlayers);
        if (result) {
          setWinner(result);
          return;
        }

        setTurn(turn + 1);
        setHasVoted(true);
      },
    });
  };

  const PlayerCard = ({
    player,
    dead = false,
  }: {
    player: any;
    dead?: boolean;
  }) => {
    const role = getRoleMeta(player.roleId);

    return (
      <Card
        size="small"
        style={{
          borderRadius: 12,
          opacity: dead ? 0.5 : 1,
        }}
      >
        <Row align="middle" gutter={12}>
          <Col>
            <Avatar src={role?.image} size={48} />
          </Col>
          <Col flex="auto">
            <Text strong delete={dead}>
              {player.name}
            </Text>
            <br />
            <Text type="secondary">{role?.name}</Text>
          </Col>
          {dead ? (
            <Tag color="red">Dead</Tag>
          ) : (
            <Button
              danger
              size="small"
              disabled={hasVoted}
              onClick={() => handleVoteKill(player.id, player.name)}
            >
              Vote
            </Button>
          )}
        </Row>
      </Card>
    );
  };

  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              🟢 Alive ({alivePlayers.length})
            </Title>
          }
          className="rounded-xl"
        >
          <Row gutter={[0, 12]} className="max-h-64 overflow-y-auto">
            {alivePlayers.length === 0 && (
              <Text type="secondary">No one alive</Text>
            )}
            {alivePlayers.map((p) => (
              <Col span={24} key={p.id}>
                <PlayerCard player={p} />
              </Col>
            ))}
          </Row>
        </Card>
      </Col>

      <Col xs={24} md={12} className="mt-4">
        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              🔴 Dead ({deadPlayers.length})
            </Title>
          }
          className="rounded-xl"
        >
          <Row gutter={[0, 12]} className="max-h-64 overflow-y-auto">
            {deadPlayers.length === 0 && (
              <Text type="secondary">No one dead yet</Text>
            )}
            {deadPlayers.map((p) => (
              <Col span={24} key={p.id}>
                <PlayerCard player={p} dead />
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
