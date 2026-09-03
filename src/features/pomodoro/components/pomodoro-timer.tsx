"use client";

import { Wave } from "@/components/loading-ui/wave";
import { useGetSetting } from "@/features/settings/hooks/use-get-setting";
import { PomodoroSetting } from "@/features/settings/types/setting.type";
import { useGetTask } from "@/features/tasks/hooks/use-get-task";
import { PomodoroSessionType } from "@/generated/prisma/enums";
import { RiCupLine, RiFocus3Line, RiMoonLine } from "@remixicon/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { TimerDurations } from "../../settings/components/settings-sheet";
import { useCreateSession } from "../hooks/use-create-session";
import { ModeConfig, TimerMode } from "../types/pomodoro.type";
import { playChime } from "../utils/audio";
import {
  requestNotificationPermission,
  sendNotification,
} from "../utils/notification";
import { TimerActions } from "./timer-actions";
import { TimerControls } from "./timer-controls";
import { TimerDisplay } from "./timer-display";
import { TimerTabs } from "./timer-tabs";

interface PomodoroTimerContentProps {
  initialDurations: TimerDurations;
  settings?: PomodoroSetting;
}

const TIMER_STORAGE_KEY = "pomodoro_timer_state";

interface PersistedTimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  targetEndTime: number | null;
  sessionsCompleted: number;
}

function getInitialTimerState(
  initialDurations: TimerDurations
): PersistedTimerState {
  if (typeof window === "undefined") {
    return {
      mode: "pomodoro",
      timeLeft: initialDurations.pomodoro * 60,
      isRunning: false,
      targetEndTime: null,
      sessionsCompleted: 0,
    };
  }

  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY);
    if (raw) {
      const saved: PersistedTimerState = JSON.parse(raw);
      if (saved.isRunning && saved.targetEndTime) {
        const remaining = Math.max(
          0,
          Math.ceil((saved.targetEndTime - Date.now()) / 1000)
        );
        if (remaining > 0) {
          return {
            mode: saved.mode || "pomodoro",
            timeLeft: remaining,
            isRunning: true,
            targetEndTime: saved.targetEndTime,
            sessionsCompleted: saved.sessionsCompleted || 0,
          };
        } else {
          return {
            mode: saved.mode || "pomodoro",
            timeLeft: 0,
            isRunning: false,
            targetEndTime: null,
            sessionsCompleted: saved.sessionsCompleted || 0,
          };
        }
      }

      const mode = saved.mode || "pomodoro";
      return {
        mode,
        timeLeft:
          typeof saved.timeLeft === "number"
            ? saved.timeLeft
            : (initialDurations[mode] ?? 25) * 60,
        isRunning: false,
        targetEndTime: null,
        sessionsCompleted: saved.sessionsCompleted || 0,
      };
    }
  } catch (error) {
    console.error("Gagal memuat status timer dari localStorage:", error);
  }

  return {
    mode: "pomodoro",
    timeLeft: initialDurations.pomodoro * 60,
    isRunning: false,
    targetEndTime: null,
    sessionsCompleted: 0,
  };
}

function PomodoroTimerContent({
  initialDurations,
  settings,
}: PomodoroTimerContentProps) {
  const [initialState] = useState(() => getInitialTimerState(initialDurations));
  const [durations, setDurations] = useState<TimerDurations>(initialDurations);
  const [mode, setMode] = useState<TimerMode>(initialState.mode);
  const [timeLeft, setTimeLeft] = useState<number>(initialState.timeLeft);
  const [isRunning, setIsRunning] = useState<boolean>(initialState.isRunning);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(
    initialState.sessionsCompleted
  );

  const { mutate: recordSession } = useCreateSession();
  const { data: tasksResponse } = useGetTask();
  const focusedTask = tasksResponse?.data?.find((t) => t.isFocused && !t.completed);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const targetEndTimeRef = useRef<number | null>(initialState.targetEndTime);
  const timeLeftRef = useRef<number>(timeLeft);
  const isRecordingRef = useRef<boolean>(false);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // Simpan status timer ke localStorage setiap kali ada perubahan state
  useEffect(() => {
    try {
      const stateToSave: PersistedTimerState = {
        mode,
        timeLeft,
        isRunning,
        targetEndTime: targetEndTimeRef.current,
        sessionsCompleted,
      };
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Gagal menyimpan status timer ke localStorage:", error);
    }
  }, [mode, timeLeft, isRunning, sessionsCompleted]);

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
      targetEndTimeRef.current = null;
      if (mode === "pomodoro") setTimeLeft(newDurations.pomodoro * 60);
      else if (mode === "shortBreak") setTimeLeft(newDurations.shortBreak * 60);
      else setTimeLeft(newDurations.longBreak * 60);
    }
  };

  const triggerChime = useCallback(() => {
    if (soundEnabled) {
      playChime();
    }
  }, [soundEnabled]);

  const handleModeChange = (newMode: TimerMode) => {
    targetEndTimeRef.current = null;
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
  };

  const togglePlayPause = () => {
    setIsRunning((prev) => {
      const next = !prev;
      if (next) {
        requestNotificationPermission();
        targetEndTimeRef.current = Date.now() + timeLeftRef.current * 1000;
      } else {
        targetEndTimeRef.current = null;
      }
      return next;
    });
  };

  const handleReset = () => {
    targetEndTimeRef.current = null;
    setIsRunning(false);
    setTimeLeft(modes[mode].duration);
  };

  const handleSessionComplete = useCallback(() => {
    if (isRecordingRef.current) return;
    isRecordingRef.current = true;

    targetEndTimeRef.current = null;
    setIsRunning(false);
    triggerChime();

    if (mode === "pomodoro") {
      sendNotification(
        "Waktunya Istirahat! ☕",
        "Sesi fokus Pomodoro Anda telah selesai."
      );
    } else {
      sendNotification(
        "Waktunya Kembali Fokus! 💪",
        "Sesi istirahat Anda telah selesai."
      );
    }

    // Record completed session to database
    const sessionType =
      mode === "pomodoro"
        ? PomodoroSessionType.FOCUS
        : mode === "shortBreak"
          ? PomodoroSessionType.SHORT_BREAK
          : PomodoroSessionType.LONG_BREAK;

    recordSession(
      {
        type: sessionType,
        duration: durations[mode],
        taskId: mode === "pomodoro" ? (focusedTask?.id || null) : null,
      },
      {
        onSettled: () => {
          isRecordingRef.current = false;
        },
        onSuccess: () => {
          toast.success(
            mode === "pomodoro"
              ? "Sesi Fokus selesai & dicatat!"
              : "Sesi Istirahat selesai!"
          );
        },
      }
    );

    // Auto advance mode
    if (mode === "pomodoro") {
      setSessionsCompleted((s) => {
        const nextCount = s + 1;
        const sessionsTarget = settings?.sessionsBeforeLongBreak || 4;
        const nextMode: TimerMode =
          nextCount % sessionsTarget === 0 ? "longBreak" : "shortBreak";
        const nextDuration = durations[nextMode] * 60;

        setMode(nextMode);
        setTimeLeft(nextDuration);

        if (settings?.autoStartBreak) {
          targetEndTimeRef.current = Date.now() + nextDuration * 1000;
          setIsRunning(true);
        }
        return nextCount;
      });
    } else {
      const nextDuration = durations.pomodoro * 60;
      setMode("pomodoro");
      setTimeLeft(nextDuration);

      if (settings?.autoStartFocus) {
        targetEndTimeRef.current = Date.now() + nextDuration * 1000;
        setIsRunning(true);
      }
    }
  }, [
    mode,
    durations,
    focusedTask,
    recordSession,
    settings,
    triggerChime,
  ]);

  // Timer Tick Effect dengan perhitungan target timestamp
  useEffect(() => {
    if (isRunning) {
      if (!targetEndTimeRef.current) {
        targetEndTimeRef.current = Date.now() + timeLeftRef.current * 1000;
      }

      const checkTime = () => {
        if (!targetEndTimeRef.current) return;
        const remaining = Math.max(
          0,
          Math.ceil((targetEndTimeRef.current - Date.now()) / 1000)
        );

        setTimeLeft(remaining);

        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          targetEndTimeRef.current = null;
          handleSessionComplete();
        }
      };

      checkTime();
      timerRef.current = setInterval(checkTime, 500);

      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          checkTime();
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, handleSessionComplete]);

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
      <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-8 min-h-100">
        <Wave className="h-10 w-14 text-primary" />
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
