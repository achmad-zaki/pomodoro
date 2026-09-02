"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RiAlertLine,
  RiCheckDoubleLine,
  RiFocus3Line,
  RiListCheck3,
  RiRefreshLine,
  RiStarLine,
  RiTargetLine,
} from "@remixicon/react";
import { useMemo, useState } from "react";
import { useDeleteTask } from "../hooks/use-delete-task";
import { useGetTask } from "../hooks/use-get-task";
import { useUpdateTask } from "../hooks/use-update-task";
import { type Task } from "../types/task.type";
import { TaskItem } from "./task-item";

export { TaskItem };

type FilterTab = "all" | "active" | "focus" | "completed";

export function TaskList() {
  const { data: tasksResponse, isLoading, isError, refetch } = useGetTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null);

  const rawTasks = tasksResponse?.data || [];

  // Enhance task items with local focus target tracking if needed
  const tasks: Task[] = useMemo(() => {
    return rawTasks.map((t, idx) => ({
      ...t,
      // If none set as focus yet, default focus state can be maintained or set via UI
      isFocus: focusTaskId ? t.id === focusTaskId : idx === 0 && !t.completed,
    }));
  }, [rawTasks, focusTaskId]);

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const focusTask = tasks.find((t) => t.isFocus && !t.completed);

  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Handler functions
  const handleToggle = (id: string, currentCompleted: boolean) => {
    updateTaskMutation.mutate({
      id,
      payload: { completed: !currentCompleted },
    });
  };

  const handleFocus = (id: string) => {
    setFocusTaskId(id === focusTaskId ? null : id);
  };

  const handleDelete = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleUpdateTitle = (id: string, newTitle: string) => {
    updateTaskMutation.mutate({
      id,
      payload: { title: newTitle },
    });
  };

  // Filter tasks depending on active filter tab
  const filteredTasks = useMemo(() => {
    switch (activeFilter) {
      case "active":
        return activeTasks;
      case "focus":
        return focusTask ? [focusTask] : [];
      case "completed":
        return completedTasks;
      default:
        return tasks;
    }
  }, [activeFilter, tasks, activeTasks, focusTask, completedTasks]);

  // Loading State with Skeletons
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-16 rounded-2xl bg-muted/40 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-7 w-16 rounded-full bg-muted/40 animate-pulse" />
          <div className="h-7 w-16 rounded-full bg-muted/40 animate-pulse" />
          <div className="h-7 w-16 rounded-full bg-muted/40 animate-pulse" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 rounded-xl bg-card border border-border/50 animate-pulse p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="size-5 rounded-lg bg-muted/60" />
                <div className="h-4 bg-muted/60 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <Card className="p-6 text-center border-destructive/20 bg-destructive/5 space-y-3">
        <div className="size-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <RiAlertLine className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Gagal memuat daftar tugas
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Periksa koneksi Anda dan coba lagi.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          className="gap-1.5 mx-auto cursor-pointer"
        >
          <RiRefreshLine className="size-3.5" />
          Coba Lagi
        </Button>
      </Card>
    );
  }

  // No Data State
  if (totalCount === 0) {
    return (
      <div className="relative p-6 text-center rounded-2xl border border-dashed border-border/80 bg-gradient-to-b from-card/80 to-card/30 backdrop-blur-xs">
        <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-xs">
          <RiListCheck3 className="size-6" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">
          Belum ada tugas
        </h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
          Tulis tugas baru di atas untuk memulai sesi fokus Pomodoro Kamu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Progress Stats Banner */}
      <div className="p-3.5 rounded-2xl bg-card border border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <RiStarLine className="size-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-foreground">
                Progres Fokus
              </span>
              <p className="text-[11px] text-muted-foreground">
                {completedCount} dari {totalCount} tugas selesai
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/40">
            {completionPercentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/50 text-xs">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={cn(
            "flex-1 py-1 px-2 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1",
            activeFilter === "all"
              ? "bg-background text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span>Semua</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-muted">
            {totalCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("active")}
          className={cn(
            "flex-1 py-1 px-2 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1",
            activeFilter === "active"
              ? "bg-background text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span>Aktif</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-muted">
            {activeTasks.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("focus")}
          className={cn(
            "flex-1 py-1 px-2 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1",
            activeFilter === "focus"
              ? "bg-background text-amber-600 dark:text-amber-400 shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <RiFocus3Line className="size-3" />
          <span>Fokus</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("completed")}
          className={cn(
            "flex-1 py-1 px-2 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1",
            activeFilter === "completed"
              ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span>Selesai</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-muted">
            {completedCount}
          </span>
        </button>
      </div>

      {/* Task List Items Container */}
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-290px)] pr-0.5 scrollbar-thin">
        {filteredTasks.length === 0 ? (
          <div className="py-8 text-center rounded-xl border border-dashed border-border/60 bg-card/40">
            <p className="text-xs font-medium text-muted-foreground">
              {activeFilter === "completed"
                ? "Belum ada tugas yang selesai"
                : activeFilter === "focus"
                  ? "Belum ada tugas fokus yang dipilih"
                  : "Tidak ada tugas"}
            </p>
          </div>
        ) : activeFilter === "all" ? (
          /* Grouped Layout when viewing ALL */
          <div className="space-y-3">
            {/* Target Fokus Section */}
            {focusTask && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 px-1 text-[11px] font-semibold text-amber-600">
                  <RiTargetLine className="size-3.5" />
                  <span>TARGET FOKUS UTAMA</span>
                </div>
                <TaskItem
                  task={focusTask}
                  onToggle={handleToggle}
                  onFocus={handleFocus}
                  onDelete={handleDelete}
                  onUpdateTitle={handleUpdateTitle}
                />
              </div>
            )}

            {/* Other Active Tasks Section */}
            {activeTasks.filter((t) => !t.isFocus).length > 0 && (
              <div className="space-y-1.5">
                {focusTask && (
                  <div className="flex items-center gap-1.5 px-1 pt-1 text-[11px] font-semibold text-muted-foreground">
                    <RiListCheck3 className="size-3.5" />
                    <span>TUGAS LAINNYA</span>
                  </div>
                )}
                {activeTasks
                  .filter((t) => !t.isFocus)
                  .map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggle}
                      onFocus={handleFocus}
                      onDelete={handleDelete}
                      onUpdateTitle={handleUpdateTitle}
                    />
                  ))}
              </div>
            )}

            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center gap-1.5 px-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <RiCheckDoubleLine className="size-3.5" />
                  <span>SELESAI ({completedTasks.length})</span>
                </div>
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggle}
                    onFocus={handleFocus}
                    onDelete={handleDelete}
                    onUpdateTitle={handleUpdateTitle}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Flat list for filtered tabs */
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onFocus={handleFocus}
              onDelete={handleDelete}
              onUpdateTitle={handleUpdateTitle}
            />
          ))
        )}
      </div>
    </div>
  );
}
