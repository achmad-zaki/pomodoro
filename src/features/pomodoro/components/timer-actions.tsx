import { Button } from "@/components/ui/button";
import SettingsSheet, {
  TimerDurations,
} from "@/features/settings/components/settings-sheet";
import TaskSheet from "@/features/tasks/components/task-sheet";
import { RiVolumeMuteLine, RiVolumeUpLine } from "@remixicon/react";

interface TimerActionsProps {
  durations: TimerDurations;
  soundEnabled: boolean;
  onUpdateDurations: (newDurations: TimerDurations) => void;
  onToggleSound: () => void;
}

export function TimerActions({
  durations,
  soundEnabled,
  onUpdateDurations,
  onToggleSound,
}: TimerActionsProps) {
  return (
    <div className="mt-5 flex justify-center gap-2">
      <TaskSheet />
      <SettingsSheet
        durations={durations}
        onUpdateDurations={onUpdateDurations}
      />
      <Button
        size="icon-lg"
        variant="secondary"
        onClick={onToggleSound}
        title={soundEnabled ? "Matikan Suara" : "Nyalakan Suara"}
      >
        {soundEnabled ? <RiVolumeUpLine /> : <RiVolumeMuteLine />}
      </Button>
    </div>
  );
}
