"use client";

import { Spinner } from "@/components/ui/spinner";
import { useGetSetting } from "@/features/settings/hooks/use-get-setting";
import { PomodoroSetting } from "@/features/settings/types/setting.type";
import { RiCupLine, RiFocus3Line, RiMoonLine } from "@remixicon/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TimerDurations } from "../../settings/components/settings-sheet";
import { ModeConfig, TimerMode } from "../types/pomodoro.type";
import { playChime } from "../utils/audio";
import { TimerActions } from "./timer-actions";
import { TimerControls } from "./timer-controls";
import { TimerDisplay } from "./timer-display";
import { TimerTabs } from "./timer-tabs";

interface PomodoroTimerContentProps {
  initialDurations: TimerDurations;
  settings?: PomodoroSetting;
}

function PomodoroTimerContent({
  initialDurations,
  settings,
}: PomodoroTimerContentProps) {
  const [durations, setDurations] = useState<TimerDurations>(initialDurations);
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState<number>(initialDurations.pomodoro * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [, setSessionsCompleted] = useState<number>(0);

  const modes: Record<TimerMode, ModeConfig> = useMemo(
    () => ({
      pomodoro: {
        label: "Pomodoro",
        duration: durations.pomodoro * 60,
        icon: RiFocus3Line,
        themeColor: "text-primary",
        ringColor: "stroke-primary",
      },
      shortBreak: {
        label: "Short Break",
        duration: durations.shortBreak * 60,
        icon: RiCupLine,
        themeColor: "text-amber-500 dark:text-amber-400",
        ringColor: "stroke-amber-500",
      },
      longBreak: {
        label: "Long Break",
        duration: durations.longBreak * 60,
        icon: RiMoonLine,
        themeColor: "text-emerald-500 dark:text-emerald-400",
        ringColor: "stroke-emerald-500",
      },
    }),
    [durations]
  );

  const handleUpdateDurations = (newDurations: TimerDurations) => {
    setDurations(newDurations);
    if (!isRunning) {
      if (mode === "pomodoro") setTimeLeft(newDurations.pomodoro * 60);
      else if (mode === "shortBreak") setTimeLeft(newDurations.shortBreak * 60);
      else setTimeLeft(newDurations.longBreak * 60);
    }
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerChime = useCallback(() => {
    if (soundEnabled) {
      playChime();
    }
  }, [soundEnabled]);

  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
  };

  const togglePlayPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(modes[mode].duration);
  };

  // Timer Tick Effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            triggerChime();

            // Auto advance mode
            if (mode === "pomodoro") {
              setSessionsCompleted((s) => {
                const nextCount = s + 1;
                const sessionsTarget = settings?.sessionsBeforeLongBreak || 4;
                const nextMode: TimerMode =
                  nextCount % sessionsTarget === 0 ? "longBreak" : "shortBreak";
                setMode(nextMode);
                setTimeLeft(modes[nextMode].duration);
                if (settings?.autoStartBreak) {
                  setIsRunning(true);
                }
                return nextCount;
              });
            } else {
              setMode("pomodoro");
              setTimeLeft(modes.pomodoro.duration);
              if (settings?.autoStartFocus) {
                setIsRunning(true);
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, triggerChime, settings, modes]);

  const modeLabel = modes[mode].label;

  // Update document title with remaining time
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    document.title = `${formatted} • ${modeLabel} | Pomodoro`;
  }, [timeLeft, modeLabel]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-8">
      <div className="w-full relative transition-all duration-300">
        {/* Mode Navigation Tabs */}
        <TimerTabs
          currentMode={mode}
          modes={modes}
          onModeChange={handleModeChange}
        />

        {/* Big Time Display */}
        <TimerDisplay timeLeft={timeLeft} />

        {/* Main Controls (Reset, Play/Pause) */}
        <TimerControls
          isRunning={isRunning}
          mode={mode}
          onReset={handleReset}
          onTogglePlayPause={togglePlayPause}
        />

        {/* Bottom Actions (TaskSheet, SettingsSheet, Sound toggle) */}
        <TimerActions
          durations={durations}
          soundEnabled={soundEnabled}
          onUpdateDurations={handleUpdateDurations}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />
      </div>
    </div>
  );
}

export default function PomodoroTimer() {
  const { data: settingResponse, isLoading } = useGetSetting();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-8 min-h-[400px]">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  const initialDurations: TimerDurations = {
    pomodoro: settingResponse?.data?.focusDuration ?? 25,
    shortBreak: settingResponse?.data?.shortBreakDuration ?? 5,
    longBreak: settingResponse?.data?.longBreakDuration ?? 15,
  };

  return (
    <PomodoroTimerContent
      key={settingResponse?.data?.id ?? "default"}
      initialDurations={initialDurations}
      settings={settingResponse?.data}
    />
  );
}
