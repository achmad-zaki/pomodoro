import { Label } from "@/components/ui/label";
import { RiCupLine, RiFocus3Line, RiMoonLine } from "@remixicon/react";
import { NumberStepper } from "./number-stepper";

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
      <div className="p-3.5 rounded-2xl border border-border bg-card space-y-3">
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
        <NumberStepper
          id="pomodoro-duration"
          min={1}
          max={180}
          step={1}
          value={focusDuration}
          onChange={(val) => onChange("focusDuration", val)}
        />
      </div>

      {/* Short Break */}
      <div className="p-3.5 rounded-2xl border border-border bg-card space-y-3">
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
        <NumberStepper
          id="short-break-duration"
          min={1}
          max={60}
          step={1}
          value={shortBreakDuration}
          onChange={(val) => onChange("shortBreakDuration", val)}
        />
      </div>

      {/* Long Break */}
      <div className="p-3.5 rounded-2xl border border-border bg-card space-y-3">
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
        <NumberStepper
          id="long-break-duration"
          min={1}
          max={90}
          step={1}
          value={longBreakDuration}
          onChange={(val) => onChange("longBreakDuration", val)}
        />
      </div>
    </div>
  );
}
