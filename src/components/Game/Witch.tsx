import { useGameDataStore } from "@/store/dataStore";
import type { NightAction, Player } from "@/types/interfaces";
import { Checkbox, Select } from "antd";

interface WitchProps {
  nightActions: NightAction;
  setNightActions: React.Dispatch<React.SetStateAction<NightAction>>;
  role: Player;
  getOptionsByRole: (roleId: string) => {
    label: string;
    value: number;
  }[];
}

const Witch = ({
  nightActions,
  setNightActions,
  role,
  getOptionsByRole,
}: WitchProps) => {
  const { witchState } = useGameDataStore();

  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        disabled={!role.alive || witchState.usedSave}
        checked={nightActions.witch?.save}
        onChange={(e) =>
          setNightActions((prev) => ({
            ...prev,
            witch: {
              ...prev.witch,
              save: e.target.checked,
            },
          }))
        }
      >
        Use rescue potion
      </Checkbox>

      <Select
        allowClear
        disabled={!role.alive || witchState.usedKill}
        placeholder="Choose someone to poison"
        style={{ width: "100%" }}
        value={nightActions.witch?.kill}
        onChange={(value) =>
          setNightActions((prev) => ({
            ...prev,
            witch: {
              ...prev.witch,
              kill: value,
            },
          }))
        }
        options={getOptionsByRole(role.roleId)}
      />
    </div>
  );
};

export default Witch;
