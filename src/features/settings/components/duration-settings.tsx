import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RiCupLine, RiFocus3Line, RiMoonLine } from "@remixicon/react";

interface DurationSettingsProps {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  onChange: (
    field: "focusDuration" | "shortBreakDuration" | "longBreakDuration",
    value: number
  ) => void;
}

export function DurationSettings({
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  onChange,
}: DurationSettingsProps) {
  return (
    <div className="space-y-4">
      <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
        Durasi Waktu (Menit)
      </Label>

      {/* Pomodoro */}
      <div className="p-3.5 rounded-2xl border border-border bg-card space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <RiFocus3Line className="size-4" />
            </div>
            <Label htmlFor="pomodoro-duration" className="font-semibold text-sm">
              Pomodoro
            </Label>
          </div>
          <span className="text-xs font-bold text-primary">
            {focusDuration} menit
          </span>
        </div>
        <Input
          id="pomodoro-duration"
          type="number"
          min={1}
          max={180}
          value={focusDuration}
          onChange={(e) =>
            onChange(
              "focusDuration",
              Math.max(1, Math.min(180, parseInt(e.target.value) || 1))
            )
          }
          className="text-sm font-medium"
        />
      </div>

      {/* Short Break */}
      <div className="p-3.5 rounded-2xl border border-border bg-card space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <RiCupLine className="size-4" />
            </div>
            <Label htmlFor="short-break-duration" className="font-semibold text-sm">
              Short Break
            </Label>
          </div>
          <span className="text-xs font-bold text-amber-500">
            {shortBreakDuration} menit
          </span>
        </div>
        <Input
          id="short-break-duration"
          type="number"
          min={1}
          max={60}
          value={shortBreakDuration}
          onChange={(e) =>
            onChange(
              "shortBreakDuration",
              Math.max(1, Math.min(60, parseInt(e.target.value) || 1))
            )
          }
          className="text-sm font-medium"
        />
      </div>

      {/* Long Break */}
      <div className="p-3.5 rounded-2xl border border-border bg-card space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <RiMoonLine className="size-4" />
            </div>
            <Label htmlFor="long-break-duration" className="font-semibold text-sm">
              Long Break
            </Label>
          </div>
          <span className="text-xs font-bold text-emerald-500">
            {longBreakDuration} menit
          </span>
        </div>
        <Input
          id="long-break-duration"
          type="number"
          min={1}
          max={90}
          value={longBreakDuration}
          onChange={(e) =>
            onChange(
              "longBreakDuration",
              Math.max(1, Math.min(90, parseInt(e.target.value) || 1))
            )
          }
          className="text-sm font-medium"
        />
      </div>
    </div>
  );
}
