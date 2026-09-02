"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    RiCheckLine,
    RiCloseLine,
    RiFocus3Line,
    RiPencilLine,
    RiTargetLine
} from "@remixicon/react";
import { useState } from "react";
import { type Task } from "../types/task.type";
import TaskDelete from "./task-delete";

export interface TaskItemProps {
    task: Task;
    onToggle?: (id: string, currentCompleted: boolean) => void;
    onFocus?: (id: string) => void;
    onDelete?: (id: string) => void;
    onUpdateTitle?: (id: string, newTitle: string) => void;
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

    const handleStartEditing = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsEditing(true);
        setEditTitle(task.title);
    };

    const handleSave = () => {
        const trimmed = editTitle.trim();
        if (trimmed && trimmed !== task.title) {
            onUpdateTitle?.(task.id, trimmed);
        } else {
            setEditTitle(task.title);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditTitle(task.title);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        }
        if (e.key === "Escape") {
            e.preventDefault();
            handleCancel();
        }
    };

    const isFocusTarget = task.isFocus && !task.completed;

    return (
        <div
            className={cn(
                "group relative flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-200 overflow-hidden",
                task.completed
                    ? "bg-muted/30 border-border/60 text-muted-foreground"
                    : isFocusTarget
                        ? "bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-card border-amber-500/40 shadow-sm ring-1 ring-amber-500/20"
                        : "bg-card border-border/70 hover:border-primary/40 hover:shadow-xs"
            )}
        >
            {/* Accent Indicator for Focus Task */}
            {isFocusTarget && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
            )}

            {/* Main Content Area: Checkbox + Title */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Checkbox */}
                <button
                    type="button"
                    onClick={() => onToggle?.(task.id, task.completed)}
                    aria-label={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
                    className={cn(
                        "size-5.5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        task.completed
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-xs scale-100"
                            : isFocusTarget
                                ? "border-amber-500/60 bg-amber-500/10 hover:bg-amber-500 hover:border-amber-500 hover:text-white"
                                : "border-muted-foreground/30 bg-background hover:border-primary hover:bg-primary/10"
                    )}
                >
                    {task.completed && (
                        <RiCheckLine className="size-4 stroke-[3] animate-in zoom-in-50 duration-150" />
                    )}
                </button>

                {/* Title or Inline Edit Input */}
                <div className="flex-1 min-w-0 flex items-center gap-2">
                    {isEditing ? (
                        <div className="flex items-center gap-1.5 w-full">
                            <Input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="h-8 text-sm px-2.5 py-1 bg-background"
                                placeholder="Nama tugas..."
                            />
                            <Button
                                type="button"
                                size="icon-xs"
                                variant="ghost"
                                onClick={handleSave}
                                title="Simpan (Enter)"
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 shrink-0"
                            >
                                <RiCheckLine className="size-4" />
                            </Button>
                            <Button
                                type="button"
                                size="icon-xs"
                                variant="ghost"
                                onClick={handleCancel}
                                title="Batal (Esc)"
                                className="text-muted-foreground hover:bg-muted shrink-0"
                            >
                                <RiCloseLine className="size-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span
                                onClick={() => onToggle?.(task.id, task.completed)}
                                onDoubleClick={handleStartEditing}
                                className={cn(
                                    "text-sm font-medium leading-normal cursor-pointer select-none transition-colors truncate",
                                    task.completed
                                        ? "line-through text-muted-foreground/80"
                                        : "text-foreground group-hover:text-foreground/90"
                                )}
                            >
                                {task.title}
                            </span>

                            {/* Focus Badge */}
                            {isFocusTarget && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[11px] font-semibold shrink-0 animate-in fade-in duration-200">
                                    <RiTargetLine className="size-3 animate-pulse" />
                                    Target Utama
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            {!isEditing && (
                <div className="flex items-center gap-1 shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">
                    {/* Toggle Focus Button */}
                    {!task.completed && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => onFocus?.(task.id)}
                            title={isFocusTarget ? "Fokus aktif" : "Jadikan Target Utama"}
                            className={cn(
                                "rounded-lg transition-colors cursor-pointer",
                                isFocusTarget
                                    ? "text-amber-500 bg-amber-500/15 hover:bg-amber-500/25"
                                    : "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                            )}
                        >
                            <RiFocus3Line className="size-3.5" />
                        </Button>
                    )}

                    {/* Edit Button */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={handleStartEditing}
                        title="Edit tugas"
                        className="rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                    >
                        <RiPencilLine className="size-3.5" />
                    </Button>

                    {/* Delete Button */}
                    <TaskDelete taskId={task.id} />
                </div>
            )}
        </div>
    );
}
