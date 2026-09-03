import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RiPauseFill, RiPlayFill, RiResetRightLine } from "@remixicon/react";
import { TimerMode } from "../types/pomodoro.type";

interface TimerControlsProps {
  isRunning: boolean;
  mode: TimerMode;
  onReset: () => void;
  onTogglePlayPause: () => void;
}

export function TimerControls({
  isRunning,
  mode,
  onReset,
  onTogglePlayPause,
}: TimerControlsProps) {
  return (
    <div className="relative z-10 flex items-center justify-center gap-4 mt-6">
      {/* Reload / Reset Button */}
      <Button
        size="icon-lg"
        variant="3d"
        onClick={onReset}
        title="Reset Timer"
        className="size-14 sm:size-16"
      >
        <RiResetRightLine className="size-5 sm:size-6" />
      </Button>

      {/* Main Play / Pause Button */}
      <Button
        size="lg"
        variant="3d"
        onClick={onTogglePlayPause}
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
  );
}
