"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  RiCupLine,
  RiFocus3Line,
  RiMoonLine,
  RiPauseFill,
  RiPlayFill,
  RiResetRightLine,
  RiVolumeMuteLine,
  RiVolumeUpLine
} from "@remixicon/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SettingsSidebar, type TimerDurations } from "./settings-sidebar";
import { TaskSidebar } from "./task-sidebar";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface ModeConfig {
  label: string;
  duration: number; // in seconds
  icon: typeof RiFocus3Line;
  themeColor: string;
  ringColor: string;
}

export default function PomodoroTimer() {
  const [durations, setDurations] = useState<TimerDurations>({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);

  const modes: Record<TimerMode, ModeConfig> = {
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
  };

  const handleUpdateDurations = (newDurations: TimerDurations) => {
    setDurations(newDurations);
    if (!isRunning) {
      setTimeLeft(newDurations[mode] * 60);
    }
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play pleasant notification chime using Web Audio API
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);

        gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.12);
        gain.gain.linearRampToValueAtTime(
          0.25,
          ctx.currentTime + index * 0.12 + 0.02
        );
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + index * 0.12 + 0.6
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.12);
        osc.stop(ctx.currentTime + index * 0.12 + 0.65);
      });
    } catch {
      // AudioContext might be blocked until user interacts
    }
  }, [soundEnabled]);

  // Handle Mode Change
  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
  };

  // Toggle Play / Pause
  const togglePlayPause = () => {
    setIsRunning((prev) => !prev);
  };

  // Reset / Reload
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
            playChime();

            // Auto advance mode
            if (mode === "pomodoro") {
              setSessionsCompleted((s) => s + 1);
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
  }, [isRunning, mode, playChime]);

  // Update document title with remaining time
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    document.title = `${formatted} • ${modes[mode].label} | Pomodoro`;
  }, [timeLeft, mode, modes]);

  // Time format helper
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-8">
      {/* Top Status & Controls */}
      {/* <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
          <ModeIcon className="size-4" />
          <span>Siklus #{sessionsCompleted + 1}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSoundEnabled((prev) => !prev)}
            title={soundEnabled ? "Matikan Suara" : "Nyalakan Suara"}
            className="text-muted-foreground hover:text-foreground rounded-full"
          >
            {soundEnabled ? (
              <RiVolumeUpLine className="size-4" />
            ) : (
              <RiVolumeMuteLine className="size-4 opacity-50" />
            )}
          </Button>
        </div>
      </div> */}

      {/* Main Timer Container */}
      <div className="w-full relative transition-all duration-300">
        {/* Tab Navigation */}
        <div className="relative z-10 flex items-center gap-1.5 justify-center p-1.5 mb-8 rounded-full bg-muted border border-border">
          {(Object.keys(modes) as TimerMode[]).map((tabMode) => {
            const isActive = mode === tabMode;
            return (
              <button
                key={tabMode}
                onClick={() => handleModeChange(tabMode)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-full transition-all duration-200 cursor-pointer select-none",
                  isActive
                    ? "bg-card text-foreground shadow-sm scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                )}
              >
                <span>{modes[tabMode].label}</span>
              </button>
            );
          })}
        </div>

        {/* Center Timer Section */}
        <div className="relative z-10 flex flex-col items-center justify-center py-8 my-4 select-none">
          <div className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight text-foreground tabular-nums">
            {formattedMinutes} : {formattedSeconds}
          </div>
        </div>

        {/* Control Buttons (Reload, Play/Pause, Skip) */}
        <div className="relative z-10 flex items-center justify-center gap-4 mt-6">
          {/* Reload / Reset Button */}
          <Button
            size="icon-lg"
            onClick={handleReset}
            title="Reset Timer"
            className="size-14 sm:size-16"
          >
            <RiResetRightLine className="size-5 sm:size-6" />
          </Button>

          {/* Main Play / Pause Button */}
          <Button
            size="lg"
            onClick={togglePlayPause}
            className={cn(
              "h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-bold gap-2.5",
              mode === "pomodoro" &&
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              mode === "shortBreak" &&
              "bg-amber-500 hover:bg-amber-600 text-white",
              mode === "longBreak" &&
              "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"
            )}
          >
            {isRunning ? (
              <>
                <RiPauseFill className="size-5 sm:size-6" />
                <span>JEDA</span>
              </>
            ) : (
              <>
                <RiPlayFill className="size-5 sm:size-6" />
                <span>MULAI</span>
              </>
            )}
          </Button>
        </div>
        <div className="mt-5 flex justify-center gap-2">
          <TaskSidebar />
          <SettingsSidebar
            durations={durations}
            onUpdateDurations={handleUpdateDurations}
          />
          <Button
            size="icon-lg"
            variant="secondary"
            onClick={() => setSoundEnabled((prev) => !prev)}
            title={soundEnabled ? "Matikan Suara" : "Nyalakan Suara"}
          >
            {soundEnabled ? <RiVolumeUpLine /> : <RiVolumeMuteLine />}
          </Button>
        </div>
      </div>
    </div>
  );
}
