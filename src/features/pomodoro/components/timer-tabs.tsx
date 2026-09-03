import { cn } from "@/lib/utils";
import { ModeConfig, TimerMode } from "../types/pomodoro.type";

interface TimerTabsProps {
  currentMode: TimerMode;
  modes: Record<TimerMode, ModeConfig>;
  onModeChange: (mode: TimerMode) => void;
}

export function TimerTabs({
  currentMode,
  modes,
  onModeChange,
}: TimerTabsProps) {
  return (
    <div className="relative z-10 flex items-center gap-1.5 justify-center p-1.5 mb-8 rounded-full bg-muted border border-border">
      {(Object.keys(modes) as TimerMode[]).map((tabMode) => {
        const isActive = currentMode === tabMode;
        return (
          <button
            key={tabMode}
            onClick={() => onModeChange(tabMode)}
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
  );
}
