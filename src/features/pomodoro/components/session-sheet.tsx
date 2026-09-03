"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { PomodoroSessionType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
  RiCalendarLine,
  RiCheckDoubleLine,
  RiCupLine,
  RiDeleteBinLine,
  RiFireLine,
  RiFocus3Line,
  RiHistoryLine,
  RiMoonLine,
  RiTimeLine,
} from "@remixicon/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateSession } from "../hooks/use-create-session";
import { useDeleteSession } from "../hooks/use-delete-session";
import { useGetSessionStats } from "../hooks/use-get-session-stats";
import { useGetSessions } from "../hooks/use-get-sessions";
import { PomodoroSession } from "../types/session.type";

type FilterType = "ALL" | PomodoroSessionType;

export default function SessionSheet() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("ALL");

  const { data: sessionsResponse, isLoading } = useGetSessions(
    selectedFilter === "ALL" ? undefined : { type: selectedFilter }
  );
  const { data: statsResponse } = useGetSessionStats();
  const deleteSessionMutation = useDeleteSession();
  const createSessionMutation = useCreateSession();

  const sessions = sessionsResponse?.data || [];
  const stats = statsResponse?.data;

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSessionMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Sesi berhasil dihapus");
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menghapus sesi");
      },
    });
  };

  // Helper function for quick testing
  const handleQuickAddSession = (type: PomodoroSessionType, duration: number) => {
    createSessionMutation.mutate(
      { type, duration },
      {
        onSuccess: () => {
          toast.success("Sesi berhasil dicatat!");
        },
        onError: (err) => {
          toast.error(err.message || "Gagal mencatat sesi");
        },
      }
    );
  };

  const formatSessionTime = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const timeFormatted = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) {
      return `Hari ini, ${timeFormatted}`;
    }

    return `${date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })}, ${timeFormatted}`;
  };

  const getSessionConfig = (type: PomodoroSessionType) => {
    switch (type) {
      case PomodoroSessionType.FOCUS:
        return {
          title: "Sesi Fokus",
          icon: RiFocus3Line,
          bgClass: "bg-primary/10 text-primary border-primary/20",
          iconColor: "text-primary",
        };
      case PomodoroSessionType.SHORT_BREAK:
        return {
          title: "Istirahat Pendek",
          icon: RiCupLine,
          bgClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          iconColor: "text-amber-500",
        };
      case PomodoroSessionType.LONG_BREAK:
        return {
          title: "Istirahat Panjang",
          icon: RiMoonLine,
          bgClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          iconColor: "text-emerald-500",
        };
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" variant="secondary" className="cursor-pointer gap-2">
          <RiHistoryLine className="size-4" />
          Sesi
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col h-full overflow-hidden sm:max-w-md">
        <SheetHeader className="p-6 shrink-0 border-b border-border/40">
          <SheetTitle className="flex items-center gap-2">
            <RiHistoryLine className="size-5 text-primary" />
            Riwayat Sesi
          </SheetTitle>
          <SheetDescription>
            Catatan sesi Pomodoro yang telah selesai dijalankan
          </SheetDescription>

          {/* Quick Stats Banner */}
          {stats && (
            <div className="grid grid-cols-3 gap-2 pt-3 mt-1">
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-primary/5 border border-primary/15">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <RiFireLine className="size-3.5 text-primary" />
                  Fokus Hari Ini
                </span>
                <span className="text-base font-bold text-foreground mt-0.5">
                  {stats.today.focusSessionsCount} sesi
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-primary/5 border border-primary/15">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <RiTimeLine className="size-3.5 text-primary" />
                  Waktu Fokus
                </span>
                <span className="text-base font-bold text-foreground mt-0.5">
                  {stats.today.focusDuration} mnt
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <RiCupLine className="size-3.5 text-amber-500" />
                  Istirahat
                </span>
                <span className="text-base font-bold text-foreground mt-0.5">
                  {stats.today.breakDuration} mnt
                </span>
              </div>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 pt-3 overflow-x-auto no-scrollbar">
            {(
              [
                { label: "Semua", value: "ALL" },
                { label: "Fokus", value: PomodoroSessionType.FOCUS },
                { label: "Istirahat", value: PomodoroSessionType.SHORT_BREAK },
                { label: "Panjang", value: PomodoroSessionType.LONG_BREAK },
              ] as const
            ).map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0",
                  selectedFilter === filter.value
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </SheetHeader>

        {/* Sessions List Content */}
        <div className="p-6 flex-1 min-h-0 overflow-y-auto flex flex-col gap-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Spinner className="size-6 text-primary" />
              <span className="text-xs text-muted-foreground">Memuat sesi...</span>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground px-4">
              <div className="p-4 rounded-full bg-muted/50 mb-3 text-muted-foreground">
                <RiCalendarLine className="size-8" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Belum ada sesi tercatat
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Selesaikan sesi fokus atau istirahat pada timer untuk mulai mencatat produktivitas Anda.
              </p>

              {/* Quick test buttons */}
              <div className="mt-5 flex flex-col gap-2 w-full max-w-xs">
                <span className="text-[11px] text-muted-foreground font-medium">
                  Uji Coba Cepat:
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs cursor-pointer"
                    disabled={createSessionMutation.isPending}
                    onClick={() =>
                      handleQuickAddSession(PomodoroSessionType.FOCUS, 25)
                    }
                  >
                    + Sesi Fokus
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs cursor-pointer"
                    disabled={createSessionMutation.isPending}
                    onClick={() =>
                      handleQuickAddSession(PomodoroSessionType.SHORT_BREAK, 5)
                    }
                  >
                    + Istirahat
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {sessions.map((session: PomodoroSession) => {
                const config = getSessionConfig(session.type);
                const Icon = config.icon;

                return (
                  <div
                    key={session.id}
                    className="group relative flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "size-10 rounded-lg flex items-center justify-center shrink-0 border",
                          config.bgClass
                        )}
                      >
                        <Icon className="size-5" />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">
                            {config.title}
                          </span>
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {session.duration} menit
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <RiTimeLine className="size-3.5" />
                            {formatSessionTime(session.completedAt)}
                          </span>

                          {session.task && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground max-w-40 truncate">
                              <RiCheckDoubleLine className="size-3 text-emerald-500 shrink-0" />
                              <span className="truncate">{session.task.title}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-muted-foreground opacity-70 hover:opacity-100 hover:text-destructive hover:bg-destructive/10 cursor-pointer shrink-0 transition-opacity"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      title="Hapus sesi"
                    >
                      <RiDeleteBinLine className="size-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <SheetFooter className="p-4 px-6 border-t border-border mt-auto flex flex-row items-center justify-between text-xs text-muted-foreground bg-muted/20 shrink-0">
          <span>
            Total Sesi:{" "}
            <strong className="text-foreground font-semibold">
              {stats?.allTime?.totalSessions || sessions.length}
            </strong>
          </span>
          <span>
            Total Fokus:{" "}
            <strong className="text-primary font-semibold">
              {stats?.allTime?.byType?.FOCUS?.totalDuration || 0} menit
            </strong>
          </span>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
