import { ROLE_ORDER } from "@/database/role";
import { useGameDataStore, type Player } from "@/store/dataStore";
import { Button, Card, Typography } from "antd";
import { useState } from "react";
import Night from "./Night";
import Day from "./Day";
import ResultModal from "./ResultModal";

const { Title } = Typography;

export default function Game() {
  const { players, phase, setPhase, setPlayers, setWinner } =
    useGameDataStore();
  const [wolfTarget, setWolfTarget] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const calledPlayers = players.filter((p) => ROLE_ORDER.includes(p.roleId));

  const checkWinCondition = (players: Player[]) => {
    const alivePlayers = players.filter((p) => p.alive);
    const aliveWolves = alivePlayers.filter((p) => p.roleId === "werewolf");

    if (aliveWolves.length === 0) {
      return "VILLAGE";
    }

    if (aliveWolves.length >= alivePlayers.length - aliveWolves.length) {
      return "WOLF";
    }

    return null;
  };

  const handleStartDay = () => {
    if (phase === "NIGHT") {
      if (!wolfTarget) return;
      const updatedPlayers = players.map((p) =>
        p.id === wolfTarget ? { ...p, alive: false } : p
      );

      setPlayers(updatedPlayers);
      setWolfTarget(null);
      const result = checkWinCondition(updatedPlayers);
      if (result) {
        setWinner(result);
        return;
      }
      setPhase("DAY");
    } else {
      setPhase("NIGHT");
    }
  };

  return (
    <>
      <ResultModal />
      <Card className="rounded-2xl">
        <Title level={3}>{phase === "NIGHT" ? "🌙 Night" : "Day"} phase</Title>
        {phase === "NIGHT" &&
          calledPlayers.map((role, id) => {
            return (
              <Night
                key={id}
                role={role}
                wolfTarget={wolfTarget}
                setWolfTarget={setWolfTarget}
              />
            );
          })}

        {phase === "DAY" && <Day checkWinCondition={checkWinCondition} setHasVoted={setHasVoted}/>}
        <Button
          type="primary"
          block
          size="large"
          className="mt-4"
          disabled={wolfTarget === null && !hasVoted}
          onClick={handleStartDay}
        >
          Start {phase === "NIGHT" ? "Day" : "Night"}
        </Button>
      </Card>
    </>
  );
}
