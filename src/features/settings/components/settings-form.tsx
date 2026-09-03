"use client";

import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { RiCheckLine, RiRefreshLine } from "@remixicon/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateSetting } from "../hooks/use-update-setting";
import { PomodoroSetting, TimerDurations } from "../types/setting.type";
import { AutomationSettings } from "./automation-settings";
import { CycleSettings } from "./cycle-settings";
import { DurationSettings } from "./duration-settings";

export const DEFAULT_SETTINGS: Omit<
  PomodoroSetting,
  "id" | "createdAt" | "updatedAt"
> = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreak: false,
  autoStartFocus: false,
};

interface SettingsFormProps {
  initialSettings: Omit<PomodoroSetting, "id" | "createdAt" | "updatedAt">;
  onUpdateDurations?: (newDurations: TimerDurations) => void;
  onClose: () => void;
}

export function SettingsForm({
  initialSettings,
  onUpdateDurations,
  onClose,
}: SettingsFormProps) {
  const queryClient = useQueryClient();
  const updateSetting = useUpdateSetting();
  const [formValues, setFormValues] = useState(initialSettings);

  const handleDurationChange = (
    field: "focusDuration" | "shortBreakDuration" | "longBreakDuration",
    value: number
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCycleChange = (value: number) => {
    setFormValues((prev) => ({
      ...prev,
      sessionsBeforeLongBreak: value,
    }));
  };

  const handleAutomationChange = (
    field: "autoStartBreak" | "autoStartFocus",
    value: boolean
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const promise = updateSetting.mutateAsync(formValues);

    toast.promise(promise, {
      loading: "Menyimpan pengaturan...",
      success: (res) => {
        queryClient.invalidateQueries({ queryKey: ["settings"] });
        onUpdateDurations?.({
          pomodoro: res.data.focusDuration,
          shortBreak: res.data.shortBreakDuration,
          longBreak: res.data.longBreakDuration,
        });
        onClose();
        return res.message || "Pengaturan berhasil diperbarui";
      },
      error: (err) => {
        return err?.message || "Gagal memperbarui pengaturan";
      },
    });
  };

  const handleResetDefault = () => {
    setFormValues(DEFAULT_SETTINGS);
  };

  return (
    <>
      <div className="p-6 flex-1 min-h-0 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        {/* Duration Customization */}
        <DurationSettings
          focusDuration={formValues.focusDuration}
          shortBreakDuration={formValues.shortBreakDuration}
          longBreakDuration={formValues.longBreakDuration}
          onChange={handleDurationChange}
        />

        {/* Cycle & Intervals */}
        <CycleSettings
          sessionsBeforeLongBreak={formValues.sessionsBeforeLongBreak}
          onChange={handleCycleChange}
        />

        {/* Automations */}
        <AutomationSettings
          autoStartBreak={formValues.autoStartBreak}
          autoStartFocus={formValues.autoStartFocus}
          onChange={handleAutomationChange}
        />
      </div>

      <SheetFooter className="p-4 px-6 border-t border-border mt-auto flex flex-row items-center justify-between bg-muted/20 shrink-0 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetDefault}
          disabled={updateSetting.isPending}
          className="text-muted-foreground hover:text-foreground text-xs gap-1 cursor-pointer"
        >
          <RiRefreshLine className="size-3.5" />
          Reset Default
        </Button>

        <Button
          size="sm"
          variant="3d"
          onClick={handleSave}
          disabled={updateSetting.isPending}
          className="cursor-pointer gap-1.5"
        >
          {updateSetting.isPending ? (
            <Spinner className="size-3.5" />
          ) : (
            <RiCheckLine className="size-3.5" />
          )}
          <span>Simpan</span>
        </Button>
      </SheetFooter>
    </>
  );
}
