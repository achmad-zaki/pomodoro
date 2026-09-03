import { Label } from "@/components/ui/label";
import { TimerDurations } from "../types/setting.type";

interface PresetSettingsProps {
  onSelectPreset: (durations: TimerDurations) => void;
}

export const PRESETS: { name: string; durations: TimerDurations }[] = [
  {
    name: "Standar",
    durations: { pomodoro: 25, shortBreak: 5, longBreak: 15 },
  },
  {
    name: "Fokus Cepat",
    durations: { pomodoro: 15, shortBreak: 3, longBreak: 10 },
  },
  {
    name: "Fokus Dalam",
    durations: { pomodoro: 50, shortBreak: 10, longBreak: 20 },
  },
];

export function PresetSettings({ onSelectPreset }: PresetSettingsProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
        Preset Cepat
      </Label>
      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onSelectPreset(preset.durations)}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/50 text-left transition-all cursor-pointer group"
          >
            <div className="text-xs font-bold text-foreground group-hover:text-primary">
              {preset.name}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {preset.durations.pomodoro}/{preset.durations.shortBreak}/{preset.durations.longBreak} m
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
