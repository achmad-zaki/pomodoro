"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { RiSettings4Line } from "@remixicon/react";
import React, { useState } from "react";
import { useGetSetting } from "../hooks/use-get-setting";
import { TimerDurations } from "../types/setting.type";
import { DEFAULT_SETTINGS, SettingsForm } from "./settings-form";

export type { TimerDurations };

export interface SettingsSheetProps {
  trigger?: React.ReactNode;
  durations?: TimerDurations;
  onUpdateDurations?: (newDurations: TimerDurations) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SettingsSheet({
  trigger,
  durations,
  onUpdateDurations,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: SettingsSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled
    ? (val: boolean) => controlledOnOpenChange?.(val)
    : setInternalOpen;

  const { data: settingResponse, isLoading } = useGetSetting();

  const initialSettings = {
    focusDuration:
      settingResponse?.data?.focusDuration ??
      durations?.pomodoro ??
      DEFAULT_SETTINGS.focusDuration,
    shortBreakDuration:
      settingResponse?.data?.shortBreakDuration ??
      durations?.shortBreak ??
      DEFAULT_SETTINGS.shortBreakDuration,
    longBreakDuration:
      settingResponse?.data?.longBreakDuration ??
      durations?.longBreak ??
      DEFAULT_SETTINGS.longBreakDuration,
    sessionsBeforeLongBreak:
      settingResponse?.data?.sessionsBeforeLongBreak ??
      DEFAULT_SETTINGS.sessionsBeforeLongBreak,
    autoStartBreak:
      settingResponse?.data?.autoStartBreak ?? DEFAULT_SETTINGS.autoStartBreak,
    autoStartFocus:
      settingResponse?.data?.autoStartFocus ?? DEFAULT_SETTINGS.autoStartFocus,
  };

  const defaultTrigger = (
    <Button
      size="icon-lg"
      variant="secondary"
      title="Pengaturan"
      className="cursor-pointer"
    >
      <RiSettings4Line />
    </Button>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger ?? defaultTrigger}</SheetTrigger>
      <SheetContent className="flex flex-col h-full overflow-hidden">
        <SheetHeader className="p-6 shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <RiSettings4Line className="size-5 text-primary" />
            Pengaturan
          </SheetTitle>
          <SheetDescription>
            Atur durasi timer & preferensi Anda
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 flex-1">
            <Spinner className="size-6 text-primary" />
          </div>
        ) : (
          <SettingsForm
            key={settingResponse?.data?.id ?? "default"}
            initialSettings={initialSettings}
            onUpdateDurations={onUpdateDurations}
            onClose={() => setIsOpen(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

export { SettingsSheet };
