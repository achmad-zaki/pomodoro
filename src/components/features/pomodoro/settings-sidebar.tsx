"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/ui/sidebar";
import {
  RiCupLine,
  RiFocus3Line,
  RiMoonLine,
  RiRefreshLine,
  RiSettings4Line
} from "@remixicon/react";
import { useEffect, useState } from "react";

export interface TimerDurations {
  pomodoro: number; // in minutes
  shortBreak: number; // in minutes
  longBreak: number; // in minutes
}

interface SettingsSidebarProps {
  trigger?: React.ReactNode;
  durations: TimerDurations;
  onUpdateDurations: (newDurations: TimerDurations) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const PRESETS: { name: string; durations: TimerDurations }[] = [
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

export function SettingsSidebar({
  trigger,
  durations,
  onUpdateDurations,
  isOpen,
  onClose,
}: SettingsSidebarProps) {
  const [formValues, setFormValues] = useState<TimerDurations>(durations);

  // Sync internal form values when props change
  useEffect(() => {
    setFormValues(durations);
  }, [durations]);

  const handleChange = (key: keyof TimerDurations, value: number) => {
    const validVal = Math.max(1, Math.min(180, value || 1));
    const newValues = { ...formValues, [key]: validVal };
    setFormValues(newValues);
    onUpdateDurations(newValues);
  };

  const handleApplyPreset = (preset: TimerDurations) => {
    setFormValues(preset);
    onUpdateDurations(preset);
  };

  const defaultTrigger = (
    <Button size="icon-lg" variant="secondary" title="Pengaturan">
      <RiSettings4Line />
    </Button>
  );

  return (
    <Sidebar
      trigger={trigger ?? defaultTrigger}
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan"
      description="Atur durasi timer & preferensi Anda"
      icon={<RiSettings4Line className="size-5" />}
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              const defaultVal = { pomodoro: 25, shortBreak: 5, longBreak: 15 };
              setFormValues(defaultVal);
              onUpdateDurations(defaultVal);
            }}
            className="text-muted-foreground hover:text-foreground text-xs gap-1"
          >
            <RiRefreshLine className="size-3.5" />
            Reset Default
          </Button>
          <span className="text-[11px] text-muted-foreground font-medium">
            Otomatis tersimpan
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Preset Section */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
            Preset Cepat
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset.durations)}
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

        {/* Custom Duration Inputs */}
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
                {formValues.pomodoro} menit
              </span>
            </div>
            <Input
              id="pomodoro-duration"
              type="number"
              min={1}
              max={180}
              value={formValues.pomodoro}
              onChange={(e) => handleChange("pomodoro", parseInt(e.target.value) || 0)}
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
                {formValues.shortBreak} menit
              </span>
            </div>
            <Input
              id="short-break-duration"
              type="number"
              min={1}
              max={60}
              value={formValues.shortBreak}
              onChange={(e) => handleChange("shortBreak", parseInt(e.target.value) || 0)}
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
                {formValues.longBreak} menit
              </span>
            </div>
            <Input
              id="long-break-duration"
              type="number"
              min={1}
              max={90}
              value={formValues.longBreak}
              onChange={(e) => handleChange("longBreak", parseInt(e.target.value) || 0)}
              className="text-sm font-medium"
            />
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
