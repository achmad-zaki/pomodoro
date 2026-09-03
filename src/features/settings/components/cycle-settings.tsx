import { Label } from "@/components/ui/label";
import { RiRepeatLine } from "@remixicon/react";
import { NumberStepper } from "./number-stepper";

interface CycleSettingsProps {
  sessionsBeforeLongBreak: number;
  onChange: (value: number) => void;
}

export function CycleSettings({
  sessionsBeforeLongBreak,
  onChange,
}: CycleSettingsProps) {
  return (
    <div className="space-y-4">
      <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
        Siklus & Interval
      </Label>

      <div className="p-3.5 rounded-2xl border border-border bg-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <RiRepeatLine className="size-4" />
            </div>
            <Label htmlFor="sessions-interval" className="font-semibold text-sm">
              Sesi Sebelum Long Break
            </Label>
          </div>
          <span className="text-xs font-bold text-indigo-500">
            {sessionsBeforeLongBreak} sesi
          </span>
        </div>

        <NumberStepper
          id="sessions-interval"
          min={1}
          max={20}
          step={1}
          value={sessionsBeforeLongBreak}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
