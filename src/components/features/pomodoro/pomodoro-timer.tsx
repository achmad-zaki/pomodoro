"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  RiCupLine,
  RiFocus3Line,
  RiListCheck3,
  RiMoonLine,
  RiPauseFill,
  RiPlayFill,
  RiRestartLine,
  RiVolumeUpLine
} from "@remixicon/react";
import { useCallback, useEffect, useRef, useState } from "react";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface ModeConfig {
  label: string;
  duration: number; // in seconds
  icon: typeof RiFocus3Line;
  themeColor: string;
  ringColor: string;
}

const MODES: Record<TimerMode, ModeConfig> = {
  pomodoro: {
    label: "Pomodoro",
    duration: 25 * 60,
    icon: RiFocus3Line,
    themeColor: "text-primary",
    ringColor: "stroke-primary",
  },
  shortBreak: {
    label: "Short Break",
    duration: 5 * 60,
    icon: RiCupLine,
    themeColor: "text-amber-500 dark:text-amber-400",
    ringColor: "stroke-amber-500",
  },
  longBreak: {
    label: "Long Break",
    duration: 15 * 60,
    icon: RiMoonLine,
    themeColor: "text-emerald-500 dark:text-emerald-400",
    ringColor: "stroke-emerald-500",
  },
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState<number>(MODES.pomodoro.duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);

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
    setTimeLeft(MODES[newMode].duration);
  };

  // Toggle Play / Pause
  const togglePlayPause = () => {
    setIsRunning((prev) => !prev);
  };

  // Reset / Reload
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].duration);
  };

  // Skip to next session
  const handleSkip = () => {
    setIsRunning(false);
    if (mode === "pomodoro") {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      if (newSessions % 4 === 0) {
        handleModeChange("longBreak");
      } else {
        handleModeChange("shortBreak");
      }
    } else {
      handleModeChange("pomodoro");
    }
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
    document.title = `${formatted} • ${MODES[mode].label} | Pomodoro`;
  }, [timeLeft, mode]);

  // Time format helper
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  // Circular progress calculation
  const totalDuration = MODES[mode].duration;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const strokeDashoffset = 100 - progress;

  const currentModeInfo = MODES[mode];
  const ModeIcon = currentModeInfo.icon;

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
          {(Object.keys(MODES) as TimerMode[]).map((tabMode) => {
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
                <span>{MODES[tabMode].label}</span>
              </button>
            );
          })}
        </div>

        {/* Center Timer Section */}
        <div className="relative z-10 flex flex-col items-center justify-center py-4 my-2">
          {/* Circular SVG Ring & Time Display */}
          <div className="relative flex items-center justify-center size-64 sm:size-72">
            <svg
              className="size-full -rotate-90 transform"
              viewBox="0 0 100 100"
            >
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-muted"
                strokeWidth="5"
                fill="transparent"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="44"
                className={cn(
                  "transition-all duration-500 ease-linear",
                  mode === "pomodoro" && "stroke-primary",
                  mode === "shortBreak" && "stroke-amber-500",
                  mode === "longBreak" && "stroke-emerald-500"
                )}
                strokeWidth="5"
                strokeDasharray="276.46"
                strokeDashoffset={(276.46 * strokeDashoffset) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Centered Numbers */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight text-foreground select-none tabular-nums">
                {formattedMinutes}:{formattedSeconds}
              </div>
            </div>
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
            <RiRestartLine className="size-5 sm:size-6" />
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
          <Button size="lg" variant="secondary">
            <RiListCheck3 />
            Tugas
          </Button>
          <Button size="icon-lg" variant="secondary">
            <RiVolumeUpLine />
          </Button>
        </div>
      </div>
    </div>
  );
}
