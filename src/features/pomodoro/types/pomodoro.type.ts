import { RiFocus3Line } from "@remixicon/react";

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export interface ModeConfig {
  label: string;
  duration: number; // in seconds
  icon: typeof RiFocus3Line;
  themeColor: string;
  ringColor: string;
}
