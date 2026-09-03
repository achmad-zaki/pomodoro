"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    RiCheckLine,
    RiCloseLine,
    RiDeleteBin6Line,
    RiFocus3Line,
    RiPencilLine,
    RiTargetLine
} from "@remixicon/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteTask } from "../hooks/use-delete-task";
import { type Task } from "../types/task.type";

export interface TaskItemProps {
    task: Task;
    isFocused?: boolean;
    onToggle?: (id: string, currentCompleted: boolean) => void;
    onFocus?: (id: string) => void;
    onDelete?: (id: string) => void;
    onUpdateTitle?: (id: string, newTitle: string) => void;
}

export function TaskItem({
    task,
    isFocused,
    onToggle,
    onFocus,
    onDelete,
    onUpdateTitle,
}: TaskItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);

    const deleteTask = useDeleteTask();
    const queryClient = useQueryClient();

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

    const handleDelete = () => {
        const promise = deleteTask.mutateAsync(task.id);

        toast.promise(promise, {
            loading: "Menghapus tugas...",
            success: () => {
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                onDelete?.(task.id);
                return "Tugas berhasil dihapus";
            },
            error: (error) => {
                return error.message;
            },
        });
    };

    const isFocusTarget = Boolean(
        (isFocused !== undefined ? isFocused : task.isFocused) && !task.completed
    );

    return (
        <div
            className={cn(
                "group relative flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 overflow-hidden",
                task.completed
                    ? "bg-emerald-50 border-emerald-500/30 text-emerald-900"
                    : isFocusTarget
                        ? "bg-linear-to-r from-amber-500/10 via-amber-500/5 to-card border-amber-500/40"
                        : "bg-card border-border hover:border-primary/40"
            )}
        >
            {/* Checkbox */}
            <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggle?.(task.id, task.completed)}
                aria-label={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
                className="mt-0.5 cursor-pointer data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
            />

            {/* Content Area: Title & Action Buttons below */}
            <div className="flex-1 min-w-0 space-y-1.5">
                {/* Title or Inline Edit Input */}
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
                        <button
                            type="button"
                            onClick={handleSave}
                            title="Simpan (Enter)"
                            className="text-emerald-600 hover:text-emerald-700 shrink-0"
                        >
                            <RiCheckLine className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            title="Batal (Esc)"
                            className="text-muted-foreground shrink-0"
                        >
                            <RiCloseLine className="size-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between gap-2">
                        <span
                            onClick={() => onToggle?.(task.id, task.completed)}
                            onDoubleClick={handleStartEditing}
                            className={cn(
                                "text-sm font-medium leading-normal cursor-pointer select-none transition-colors",
                                task.completed
                                    ? "text-emerald-700"
                                    : "text-foreground group-hover:text-foreground/90"
                            )}
                        >
                            {task.title}
                        </span>

                        {/* Focus Badge */}
                        {isFocusTarget && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30 text-[11px] font-semibold shrink-0 animate-in fade-in duration-200">
                                <RiTargetLine className="size-3" />
                                Target Utama
                            </span>
                        )}
                    </div>
                )}

                {/* Action Buttons Underneath Title */}
                {!isEditing && (
                    <div className="flex items-center gap-1 pt-0.5">
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
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={handleDelete}
                            title="Hapus tugas"
                            className="rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                            <RiDeleteBin6Line className="size-3.5" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
