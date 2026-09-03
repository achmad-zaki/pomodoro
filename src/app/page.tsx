import PomodoroTimer from "@/features/pomodoro/components/pomodoro-timer";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <main className="flex-1 flex items-center justify-center py-4">
        <PomodoroTimer />
      </main>
    </div>
  );
}
