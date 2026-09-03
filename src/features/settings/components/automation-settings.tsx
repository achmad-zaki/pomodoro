import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AutomationSettingsProps {
  autoStartBreak: boolean;
  autoStartFocus: boolean;
  onChange: (field: "autoStartBreak" | "autoStartFocus", value: boolean) => void;
}

export function AutomationSettings({
  autoStartBreak,
  autoStartFocus,
  onChange,
}: AutomationSettingsProps) {
  return (
    <div className="space-y-3">
      <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
        Otomatisasi
      </Label>

      <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-card">
        <div className="space-y-0.5">
          <Label
            htmlFor="auto-start-break"
            className="text-sm font-semibold cursor-pointer"
          >
            Mulai Istirahat Otomatis
          </Label>
          <p className="text-xs text-muted-foreground">
            Timer istirahat langsung mulai saat fokus selesai
          </p>
        </div>
        <Checkbox
          id="auto-start-break"
          checked={autoStartBreak}
          onCheckedChange={(checked) => onChange("autoStartBreak", !!checked)}
        />
      </div>

      <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-card">
        <div className="space-y-0.5">
          <Label
            htmlFor="auto-start-focus"
            className="text-sm font-semibold cursor-pointer"
          >
            Mulai Fokus Otomatis
          </Label>
          <p className="text-xs text-muted-foreground">
            Timer fokus langsung mulai saat istirahat selesai
          </p>
        </div>
        <Checkbox
          id="auto-start-focus"
          checked={autoStartFocus}
          onCheckedChange={(checked) => onChange("autoStartFocus", !!checked)}
        />
      </div>
    </div>
  );
}
