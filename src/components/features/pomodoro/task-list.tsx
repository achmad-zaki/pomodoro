"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  RiCheckLine,
  RiDeleteBin6Line,
  RiFocus3Line,
  RiListCheck3,
  RiPencilLine,
} from "@remixicon/react";
import { useState } from "react";
import { type Task } from "./task-sidebar";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onFocus: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
}

export function TaskItem({
  task,
  onToggle,
  onFocus,
  onDelete,
  onUpdateTitle,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleStartEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(task.title);
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdateTitle(task.id, editTitle.trim());
    } else {
      setEditTitle(task.title); // revert if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditTitle(task.title);
    }
  };

  return (
    <Card
      className={cn(
        "group relative p-3 flex items-center justify-between gap-3 transition-all duration-200 border border-border/80 hover:border-border hover:shadow-xs",
        task.completed && "bg-muted/40 opacity-75",
        task.isFocus && !task.completed &&
          "border-primary/50 ring-1 ring-primary/20 bg-primary/[0.02]"
      )}
    >
      {/* Checkbox & Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={cn(
            "size-5 rounded-lg border flex items-center justify-center transition-all shrink-0 cursor-pointer",
            task.completed
              ? "bg-primary border-primary text-primary-foreground shadow-xs"
              : "border-input bg-background hover:border-primary/50 hover:bg-accent"
          )}
        >
          {task.completed && <RiCheckLine className="size-3.5 stroke-[3]" />}
        </button>

        {/* Title / Edit input */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {isEditing ? (
            <Input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              autoFocus
              className="h-7 text-sm px-2 py-0"
            />
          ) : (
            <span
              onClick={() => onToggle(task.id)}
              onDoubleClick={handleStartEditing}
              className={cn(
                "text-sm font-medium leading-tight cursor-pointer select-none transition-colors truncate",
                task.completed
                  ? "line-through text-muted-foreground"
                  : "text-foreground hover:text-primary"
              )}
            >
              {task.title}
            </span>
          )}

          {/* Active focus pill */}
          {task.isFocus && !task.completed && (
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold shrink-0">
              Fokus
            </span>
          )}
        </div>
      </div>

      {/* Action icons */}
      <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
        {/* Focus Button */}
        {!task.completed && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onFocus(task.id)}
            title={task.isFocus ? "Fokus aktif" : "Jadikan Fokus Utama"}
            className={cn(
              "rounded-lg transition-colors",
              task.isFocus
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-muted"
            )}
          >
            <RiFocus3Line className="size-3.5" />
          </Button>
        )}

        {/* Edit button */}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleStartEditing}
          title="Edit nama tugas"
          className="rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <RiPencilLine className="size-3.5" />
        </Button>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onDelete(task.id)}
          title="Hapus tugas"
          className="rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <RiDeleteBin6Line className="size-3.5" />
        </Button>
      </div>
    </Card>
  );
}

interface TaskListProps {
  tasks: Task[];
  filter: "all" | "active" | "completed";
  onToggleTask: (id: string) => void;
  onFocusTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTaskTitle: (id: string, newTitle: string) => void;
}

export function TaskList({
  tasks,
  filter,
  onToggleTask,
  onFocusTask,
  onDeleteTask,
  onUpdateTaskTitle,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-border/80 bg-card/30">
        <div className="size-12 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto mb-3">
          <RiListCheck3 className="size-6 opacity-60" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          {filter === "completed"
            ? "Belum ada tugas yang selesai"
            : filter === "active"
              ? "Tidak ada tugas aktif!"
              : "Belum ada tugas"}
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">
          {filter === "all"
            ? "Tulis tugas baru di atas untuk mulai fokus."
            : "Semua tugas dalam kategori ini kosong."}
        </p>
      </div>
    );
  }

  return (
    <>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onFocus={onFocusTask}
          onDelete={onDeleteTask}
          onUpdateTitle={onUpdateTaskTitle}
        />
      ))}
    </>
  );
}
