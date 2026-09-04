"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    RiAddLine,
    RiArrowDownSLine,
    RiArrowRightSLine,
    RiCheckLine,
    RiCloseLine,
    RiCornerDownRightLine,
    RiDeleteBin6Line,
    RiFocus3Line,
    RiListCheck3,
    RiPencilLine,
    RiTargetLine,
} from "@remixicon/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCreateSubTask } from "../hooks/use-create-subtask";
import { useDeleteSubTask } from "../hooks/use-delete-subtask";
import { useDeleteTask } from "../hooks/use-delete-task";
import { useUpdateSubTask } from "../hooks/use-update-subtask";
import { SubTask, type Task } from "../types/task.type";

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
    const [isExpanded, setIsExpanded] = useState(false);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
    const [editingSubtaskTitle, setEditingSubtaskTitle] = useState("");

    const newSubtaskInputRef = useRef<HTMLInputElement>(null);

    const deleteTask = useDeleteTask();
    const createSubTask = useCreateSubTask();
    const updateSubTask = useUpdateSubTask();
    const deleteSubTask = useDeleteSubTask();
    const queryClient = useQueryClient();

    const subtasks: SubTask[] = task.subtasks || [];
    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter((st) => st.completed).length;
    const subtaskPercentage =
        totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

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

    // Subtask handlers
    const handleToggleSubtask = (subtask: SubTask) => {
        const nextCompleted = !subtask.completed;
        const promise = updateSubTask.mutateAsync({
            taskId: task.id,
            subtaskId: subtask.id,
            payload: { completed: nextCompleted },
        });

        toast.promise(promise, {
            loading: "Memperbarui sub-tugas...",
            success: () => {
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                return nextCompleted
                    ? `Sub-tugas "${subtask.title}" selesai!`
                    : `Sub-tugas "${subtask.title}" diaktifkan kembali`;
            },
            error: (error) => {
                return error.message;
            },
        });
    };

    const handleStartEditSubtask = (subtask: SubTask, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setEditingSubtaskId(subtask.id);
        setEditingSubtaskTitle(subtask.title);
    };

    const handleSaveSubtaskTitle = (subtaskId: string) => {
        const trimmed = editingSubtaskTitle.trim();
        if (!trimmed) {
            setEditingSubtaskId(null);
            return;
        }

        const promise = updateSubTask.mutateAsync({
            taskId: task.id,
            subtaskId,
            payload: { title: trimmed },
        });

        toast.promise(promise, {
            loading: "Memperbarui judul sub-tugas...",
            success: () => {
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                setEditingSubtaskId(null);
                return "Sub-tugas berhasil diperbarui";
            },
            error: (error) => {
                return error.message;
            },
        });
    };

    const handleDeleteSubtask = (subtaskId: string, subtaskTitle: string) => {
        const promise = deleteSubTask.mutateAsync({
            taskId: task.id,
            subtaskId,
        });

        toast.promise(promise, {
            loading: "Menghapus sub-tugas...",
            success: () => {
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                return `Sub-tugas "${subtaskTitle}" dihapus`;
            },
            error: (error) => {
                return error.message;
            },
        });
    };

    const handleAddSubtask = (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmed = newSubtaskTitle.trim();
        if (!trimmed) return;

        const promise = createSubTask.mutateAsync({
            taskId: task.id,
            title: trimmed,
        });

        toast.promise(promise, {
            loading: "Menambahkan sub-tugas...",
            success: () => {
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                setNewSubtaskTitle("");
                newSubtaskInputRef.current?.focus();
                return "Sub-tugas berhasil ditambahkan";
            },
            error: (error) => {
                return error.message;
            },
        });
    };

    const handleOpenSubtasks = () => {
        setIsExpanded(true);
        setTimeout(() => {
            newSubtaskInputRef.current?.focus();
        }, 100);
    };

    const isFocusTarget = Boolean(
        (isFocused !== undefined ? isFocused : task.isFocused) && !task.completed
    );

    return (
        <div
            className={cn(
                "group relative flex flex-col p-3.5 rounded-xl border transition-all duration-200 overflow-hidden",
                task.completed
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-900 dark:text-emerald-300"
                    : isFocusTarget
                        ? "bg-linear-to-r from-amber-500/10 via-amber-500/5 to-card border-amber-500/40"
                        : "bg-card border-border hover:border-primary/40"
            )}
        >
            {/* Top Row: Checkbox, Title/Input, Badges, and Action Buttons */}
            <div className="flex items-start gap-2.5">
                {/* Checkbox */}
                <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => onToggle?.(task.id, task.completed)}
                    aria-label={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
                    className="mt-0.5 cursor-pointer data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 shrink-0"
                />

                {/* Content Area: Title & Actions */}
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
                                className="text-emerald-600 hover:text-emerald-700 shrink-0 cursor-pointer p-1"
                            >
                                <RiCheckLine className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                title="Batal (Esc)"
                                className="text-muted-foreground hover:text-foreground shrink-0 cursor-pointer p-1"
                            >
                                <RiCloseLine className="size-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 min-w-0">
                                <span
                                    onClick={() => onToggle?.(task.id, task.completed)}
                                    onDoubleClick={handleStartEditing}
                                    className={cn(
                                        "text-sm font-medium leading-normal cursor-pointer select-none transition-colors",
                                        task.completed
                                            ? "line-through text-muted-foreground/80 dark:text-muted-foreground/70"
                                            : "text-foreground group-hover:text-foreground/90"
                                    )}
                                >
                                    {task.title}
                                </span>

                                {/* Subtask count badge */}
                                {totalSubtasks > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setIsExpanded((prev) => !prev)}
                                        title={isExpanded ? "Tutup sub-tugas" : "Lihat sub-tugas"}
                                        className={cn(
                                            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer border",
                                            completedSubtasks === totalSubtasks
                                                ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                                                : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                                        )}
                                    >
                                        <RiListCheck3 className="size-3" />
                                        <span>
                                            {completedSubtasks}/{totalSubtasks}
                                        </span>
                                        {isExpanded ? (
                                            <RiArrowDownSLine className="size-3 -ml-0.5" />
                                        ) : (
                                            <RiArrowRightSLine className="size-3 -ml-0.5" />
                                        )}
                                    </button>
                                )}
                            </div>

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

                            {/* Add Subtask / Expand Subtasks Button */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={handleOpenSubtasks}
                                title="Tambah atau lihat sub-tugas"
                                className={cn(
                                    "rounded-lg transition-colors cursor-pointer",
                                    isExpanded
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                                )}
                            >
                                <RiCornerDownRightLine className="size-3.5" />
                            </Button>

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
                                disabled={deleteTask.isPending}
                                title="Hapus tugas"
                                className="rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer disabled:opacity-50"
                            >
                                <RiDeleteBin6Line className="size-3.5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mini Progress Bar when has subtasks */}
            {totalSubtasks > 0 && !isExpanded && (
                <div className="mt-2.5 pt-1.5 border-t border-border/40 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-300",
                                completedSubtasks === totalSubtasks
                                    ? "bg-emerald-500"
                                    : "bg-primary"
                            )}
                            style={{ width: `${subtaskPercentage}%` }}
                        />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                        {completedSubtasks}/{totalSubtasks} ({subtaskPercentage}%)
                    </span>
                </div>
            )}

            {/* Collapsible Subtasks Section */}
            {isExpanded && (
                <div className="mt-3 pt-2.5 border-t border-border/60 pl-3 sm:pl-4 space-y-2 relative animate-in fade-in duration-200">
                    {/* Visual guide line */}
                    <div className="absolute left-1.5 top-3 bottom-2 w-0.5 bg-border/60 rounded-full" />

                    {/* Subtasks header & progress bar */}
                    {totalSubtasks > 0 && (
                        <div className="space-y-1 pb-1">
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                <span className="font-medium">Sub-tugas:</span>
                                <span>
                                    {completedSubtasks} dari {totalSubtasks} selesai ({subtaskPercentage}%)
                                </span>
                            </div>
                            <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-300",
                                        completedSubtasks === totalSubtasks
                                            ? "bg-emerald-500"
                                            : "bg-primary"
                                    )}
                                    style={{ width: `${subtaskPercentage}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Subtasks items list */}
                    <div className="space-y-1.5">
                        {subtasks.map((st) => (
                            <div
                                key={st.id}
                                className={cn(
                                    "group/sub flex items-center justify-between gap-2 p-1.5 px-2 rounded-lg text-xs transition-colors",
                                    st.completed
                                        ? "bg-emerald-500/5 text-muted-foreground"
                                        : "bg-muted/40 hover:bg-muted/70 text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <Checkbox
                                        checked={st.completed}
                                        onCheckedChange={() => handleToggleSubtask(st)}
                                        aria-label={
                                            st.completed
                                                ? `Tandai belum selesai: ${st.title}`
                                                : `Tandai selesai: ${st.title}`
                                        }
                                        className="size-3.5 rounded-sm cursor-pointer data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                    />

                                    {editingSubtaskId === st.id ? (
                                        <div className="flex items-center gap-1 flex-1">
                                            <Input
                                                type="text"
                                                value={editingSubtaskTitle}
                                                onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleSaveSubtaskTitle(st.id);
                                                    }
                                                    if (e.key === "Escape") {
                                                        e.preventDefault();
                                                        setEditingSubtaskId(null);
                                                    }
                                                }}
                                                autoFocus
                                                className="h-6 text-xs px-1.5 py-0 bg-background"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSubtaskTitle(st.id)}
                                                className="text-emerald-600 hover:text-emerald-700 cursor-pointer p-0.5"
                                            >
                                                <RiCheckLine className="size-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingSubtaskId(null)}
                                                className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                                            >
                                                <RiCloseLine className="size-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <span
                                            onClick={() => handleToggleSubtask(st)}
                                            onDoubleClick={(e) => handleStartEditSubtask(st, e)}
                                            className={cn(
                                                "truncate cursor-pointer select-none",
                                                st.completed && "line-through text-muted-foreground/70"
                                            )}
                                        >
                                            {st.title}
                                        </span>
                                    )}
                                </div>

                                {/* Subtask Action buttons */}
                                {editingSubtaskId !== st.id && (
                                    <div className="flex items-center gap-0.5 opacity-80 group-hover/sub:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={(e) => handleStartEditSubtask(st, e)}
                                            title="Edit sub-tugas"
                                            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-background/80 cursor-pointer"
                                        >
                                            <RiPencilLine className="size-3" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteSubtask(st.id, st.title)}
                                            title="Hapus sub-tugas"
                                            className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                        >
                                            <RiDeleteBin6Line className="size-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Quick Add Subtask Input */}
                    <form onSubmit={handleAddSubtask} className="flex items-center gap-1.5 pt-1">
                        <Input
                            ref={newSubtaskInputRef}
                            type="text"
                            value={newSubtaskTitle}
                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                            placeholder="Tambah sub-tugas (contoh: BAB I)..."
                            className="h-7 text-xs px-2 bg-background/80"
                            disabled={createSubTask.isPending}
                        />
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!newSubtaskTitle.trim() || createSubTask.isPending}
                            className="h-7 px-2 text-xs gap-1 shrink-0 cursor-pointer"
                        >
                            <RiAddLine className="size-3.5" />
                            <span>Tambah</span>
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
}
