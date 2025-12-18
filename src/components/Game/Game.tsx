import { ROLE_ORDER } from "@/database/role";
import { useGameDataStore } from "@/store/dataStore";
import { Button, Card, Modal, Typography } from "antd";
import { useState } from "react";
import Night from "./Night";
import Day from "./Day";
import ResultModal from "./ResultModal";
import type { NightAction, Player } from "@/utils/interfaces";
import { FastForwardOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function Game() {
  const { players, phase, setPhase, setPlayers, setWinner, setWitchState } =
    useGameDataStore();
  const [hasVoted, setHasVoted] = useState(false);
  const [nightActions, setNightActions] = useState<NightAction>({});

  const roleOrderMap = Object.fromEntries(
    ROLE_ORDER.map((roleId, index) => [roleId, index])
  );

  const calledPlayers = players
    .filter((p) => ROLE_ORDER.includes(p.roleId))
    .sort((a, b) => roleOrderMap[a.roleId] - roleOrderMap[b.roleId]);

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
      const wolfTarget = nightActions.werewolf;
      const guardTarget = nightActions.bodyguard;
      const witchTarget = nightActions.witch;
      const hunterTarget = nightActions.hunter;

      if (!wolfTarget) return;

      let updatedPlayers = [...players];
      const deadIds = new Set<number>();

      if (wolfTarget !== guardTarget && !witchTarget?.save) {
        deadIds.add(wolfTarget);
      }

      if (witchTarget?.kill !== undefined) {
        deadIds.add(witchTarget.kill);
      }

      const hunter = players.find((p) => p.roleId === "hunter" && p.alive);

      const hunterDies = hunter && deadIds.has(hunter.id);

      if (hunterDies && hunterTarget !== undefined) {
        deadIds.add(hunterTarget);
      }

      updatedPlayers = players.map((p) =>
        deadIds.has(p.id) ? { ...p, alive: false } : p
      );

      setWitchState({
        usedSave: !!witchTarget?.save,
        usedKill: witchTarget?.kill !== undefined,
      });

      setPlayers(updatedPlayers);
      setNightActions({});
      setHasVoted(false);

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

  const handleSkipVote = () => {
    Modal.confirm({
      title: "Confirm execution",
      content: `Are you sure to skip vote ?`,
      okText: "Skip",
      okType: "primary",
      cancelText: "Cancel",
      centered: true,
      onOk: () => setPhase("NIGHT"),
    });
  };

  const checkEnabled = () => {
    if (phase === "DAY") {
      return !hasVoted;
    }

    const aliveRoles = players.filter((p) => p.alive).map((p) => p.roleId);

    const wolfAlive = aliveRoles.includes("werewolf");
    const guardAlive = aliveRoles.includes("bodyguard");
    const seerAlive = aliveRoles.includes("seer");
    const hunterAlive = aliveRoles.includes("hunter");

    if (seerAlive && nightActions.seer === undefined) {
      return true;
    }

    if (wolfAlive && nightActions.werewolf === undefined) {
      return true;
    }

    if (guardAlive && nightActions.bodyguard === undefined) {
      return true;
    }

    if (hunterAlive && nightActions.hunter === undefined) {
      return true;
    }

    return false;
  };

  return (
    <>
      <ResultModal />
      <Card className="rounded-2xl">
        <div className="flex flex-row items-center justify-between">
          <Title level={3}>
            {phase === "NIGHT" ? "🌙 Night" : "Day"} phase
          </Title>
          {phase === "DAY" && (
            <Button
              type="text"
              icon={<FastForwardOutlined />}
              onClick={handleSkipVote}
            >
              Skip vote
            </Button>
          )}
        </div>
        <div className="max-h-[520px] overflow-y-auto flex flex-col gap-2">
          {phase === "NIGHT" &&
            calledPlayers.map((role) => {
              return (
                <Night
                  key={role.id}
                  role={role}
                  nightActions={nightActions}
                  setNightActions={setNightActions}
                />
              );
            })}
        </div>

        {phase === "DAY" && (
          <Day
            checkWinCondition={checkWinCondition}
            hasVoted={hasVoted}
            setHasVoted={setHasVoted}
          />
        )}
        <Button
          type="primary"
          block
          size="large"
          className="mt-4"
          disabled={checkEnabled()}
          onClick={handleStartDay}
        >
          Start {phase === "NIGHT" ? "Day" : "Night"}
        </Button>
      </Card>
    </>
  );
}
