interface TimerDisplayProps {
  timeLeft: number;
}

export function TimerDisplay({ timeLeft }: TimerDisplayProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-8 my-4 select-none">
      <div className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight text-foreground tabular-nums">
        {formattedMinutes} : {formattedSeconds}
      </div>
    </div>
  );
}
