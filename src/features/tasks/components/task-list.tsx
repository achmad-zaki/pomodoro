"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  RiAlertLine,
  RiCheckDoubleLine,
  RiListCheck3,
  RiRefreshLine,
  RiStarLine,
  RiTargetLine,
} from "@remixicon/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDeleteTask } from "../hooks/use-delete-task";
import { useGetTask } from "../hooks/use-get-task";
import { useUpdateTask } from "../hooks/use-update-task";
import { type Task } from "../types/task.type";
import { TaskItem } from "./task-item";

export { TaskItem };

export function TaskList() {
  const { data: tasksResponse, isLoading, isError, refetch } = useGetTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const queryClient = useQueryClient();

  const tasks: Task[] = tasksResponse?.data || [];

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const focusTask = tasks.find((t) => t.isFocused && !t.completed);

  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Handler functions
  const handleToggle = (id: string, currentCompleted: boolean) => {
    const nextCompleted = !currentCompleted;
    const promise = updateTaskMutation.mutateAsync({
      id,
      payload: {
        completed: nextCompleted,
        ...(nextCompleted ? { isFocused: false } : {}),
      },
    });

    toast.promise(promise, {
      loading: "Memperbarui status tugas...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        return nextCompleted ? "Tugas selesai!" : "Tugas diaktifkan kembali";
      },
      error: (error) => {
        return error.message;
      },
    });
  };

  const handleFocus = (id: string) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const nextFocused = !targetTask.isFocused;
    const promise = updateTaskMutation.mutateAsync({
      id,
      payload: { isFocused: nextFocused },
    });

    toast.promise(promise, {
      loading: nextFocused ? "Menetapkan target fokus..." : "Menghapus target fokus...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        return nextFocused ? "Target fokus berhasil diatur" : "Target fokus dinonaktifkan";
      },
      error: (error) => {
        return error.message;
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleUpdateTitle = (id: string, newTitle: string) => {
    const promise = updateTaskMutation.mutateAsync({
      id,
      payload: { title: newTitle },
    });

    toast.promise(promise, {
      loading: "Memperbarui tugas...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        return "Tugas berhasil diperbarui";
      },
      error: (error) => {
        return error.message;
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-16 rounded-2xl bg-muted/40 animate-pulse" />
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
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden space-y-3.5">
      {/* Progress Stats Banner */}
      <div className="p-3.5 rounded-2xl bg-card border border-border space-y-2.5 shrink-0">
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

      {/* Task List Items Container */}
      <div className="flex-1 min-h-0 space-y-3 overflow-y-auto no-scrollbar">
        {/* Target Fokus Section */}
        {focusTask && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 px-1 text-[11px] font-semibold text-amber-600">
              <RiTargetLine className="size-3.5" />
              <span>TARGET FOKUS UTAMA</span>
            </div>
            <TaskItem
              task={focusTask}
              isFocused={true}
              onToggle={handleToggle}
              onFocus={handleFocus}
              onDelete={handleDelete}
              onUpdateTitle={handleUpdateTitle}
            />
          </div>
        )}

        {/* Other Active Tasks Section */}
        {activeTasks.filter((t) => !t.isFocused).length > 0 && (
          <div className="space-y-1.5">
            {focusTask && (
              <div className="flex items-center gap-1.5 px-1 pt-1 text-[11px] font-semibold text-muted-foreground">
                <RiListCheck3 className="size-3.5" />
                <span>TUGAS LAINNYA</span>
              </div>
            )}
            {activeTasks
              .filter((t) => !t.isFocused)
              .map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isFocused={false}
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
            <div className="flex items-center gap-1.5 px-1 text-[11px] font-semibold text-emerald-600">
              <RiCheckDoubleLine className="size-3.5" />
              <span>SELESAI ({completedTasks.length})</span>
            </div>
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isFocused={false}
                onToggle={handleToggle}
                onFocus={handleFocus}
                onDelete={handleDelete}
                onUpdateTitle={handleUpdateTitle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
