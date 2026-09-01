"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  RiAddLine,
  RiCheckDoubleLine,
  RiFireFill,
  RiFocus3Line,
  RiListCheck3,
} from "@remixicon/react";
import { useState } from "react";
import { TaskList } from "./task-list";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  isFocus?: boolean;
}

interface TaskSidebarProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Fokus belajar Next.js 15 & React 19",
    completed: false,
    isFocus: true,
  },
  {
    id: "2",
    title: "Selesaikan desain UI Task Sidebar Pomodoro",
    completed: true,
    isFocus: false,
  },
  {
    id: "3",
    title: "Refactoring & optimisasi performa",
    completed: false,
    isFocus: false,
  },
];

type FilterType = "all" | "active" | "completed";

export function TaskSidebar({ trigger, isOpen, onClose }: TaskSidebarProps = {}) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      isFocus: tasks.length === 0, // Auto focus if first task
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const setFocusTask = (id: string) => {
    setTasks(
      tasks.map((task) => ({
        ...task,
        isFocus: task.id === id,
      }))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const updateTaskTitle = (id: string, newTitle: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = totalTasks - completedCount;

  const progressPercent =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const currentFocusTask = tasks.find((t) => t.isFocus && !t.completed);

  // Filtered tasks list
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const defaultTrigger = (
    <Button size="lg" variant="secondary">
      <RiListCheck3 />
      Tugas
    </Button>
  );

  return (
    <Sidebar
      trigger={trigger ?? defaultTrigger}
      isOpen={isOpen}
      onClose={onClose}
      title="Daftar Tugas"
      description="Kelola target & fokus Anda"
      icon={<RiListCheck3 className="size-5" />}
      footer={
        <>
          <div className="flex items-center gap-1">
            <span>
              {completedCount} dari {totalTasks} tugas selesai
            </span>
          </div>
          {completedCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={clearCompleted}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-[11px] font-medium gap-1 rounded-lg"
            >
              <RiCheckDoubleLine className="size-3.5" />
              Hapus Selesai
            </Button>
          )}
        </>
      }
    >
      {/* Progress Stats Card */}
      {totalTasks > 0 && (
        <div className="bg-linear-to-br from-card to-muted/40 p-4 rounded-2xl border border-border/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground flex items-center gap-1">
              <RiFireFill className="size-3.5 text-primary" />
              Kemajuan Sesi
            </span>
            <span className="font-bold text-foreground">
              {progressPercent}% ({completedCount}/{totalTasks} Tugas)
            </span>
          </div>
          {/* Progress Bar */}
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Current Focus Highlight */}
      {currentFocusTask && (
        <div className="bg-primary/5 border border-primary/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
              <RiFocus3Line className="size-4 animate-pulse" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold tracking-wider uppercase text-primary block">
                Fokus Saat Ini
              </span>
              <p className="text-sm font-semibold text-foreground truncate">
                {currentFocusTask.title}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      <form
        onSubmit={handleAddTask}
        className="bg-card border border-border rounded-2xl p-2.5 shadow-xs transition-all focus-within:border-primary/50"
      >
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Tambah tugas baru..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 px-2 text-sm"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newTaskTitle.trim()}
            className="shrink-0 rounded-xl px-3 font-semibold"
          >
            <RiAddLine className="size-4" />
            <span>Tambah</span>
          </Button>
        </div>
      </form>

      {/* Filter Tabs */}
      {totalTasks > 0 && (
        <div className="flex items-center justify-between gap-1 p-1 bg-muted rounded-xl text-xs font-medium">
          {(
            [
              { key: "all", label: "Semua", count: totalTasks },
              { key: "active", label: "Aktif", count: activeCount },
              { key: "completed", label: "Selesai", count: completedCount },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer font-semibold flex items-center justify-center gap-1.5",
                filter === tab.key
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full",
                  filter === tab.key
                    ? "bg-muted text-foreground"
                    : "bg-muted-foreground/15 text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Task Cards List */}
      <div className="space-y-2 pt-1">
        <TaskList
          tasks={filteredTasks}
          filter={filter}
          onToggleTask={toggleTask}
          onFocusTask={setFocusTask}
          onDeleteTask={deleteTask}
          onUpdateTaskTitle={updateTaskTitle}
        />
      </div>
    </Sidebar>
  );
}



