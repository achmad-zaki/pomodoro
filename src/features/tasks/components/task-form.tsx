"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    RiAddLine,
    RiArrowDownSLine,
    RiArrowUpSLine,
    RiCloseLine,
    RiGitBranchLine,
} from "@remixicon/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateTask } from "../hooks/use-create-task";

const createTaskSchema = z.object({
    title: z
        .string()
        .min(1, { message: "Judul tugas tidak boleh kosong" })
        .max(255, { message: "Judul tugas tidak boleh lebih dari 255 karakter" }),
});

type TaskFormData = z.infer<typeof createTaskSchema>;

export default function TaskForm() {
    const [showSubtasks, setShowSubtasks] = useState(false);
    const [subtaskInput, setSubtaskInput] = useState("");
    const [subtasks, setSubtasks] = useState<string[]>([]);

    const createTask = useCreateTask();
    const queryClient = useQueryClient();

    const form = useForm<TaskFormData>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
        },
    });

    const handleAddSubtaskChip = () => {
        const trimmed = subtaskInput.trim();
        if (!trimmed) return;
        if (subtasks.includes(trimmed)) {
            toast.error("Sub-tugas ini sudah ditambahkan");
            return;
        }
        setSubtasks((prev) => [...prev, trimmed]);
        setSubtaskInput("");
    };

    const handleSubtaskKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddSubtaskChip();
        }
    };

    const handleRemoveSubtaskChip = (indexToRemove: number) => {
        setSubtasks((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const onSubmit = (data: TaskFormData) => {
        const payload = {
            title: data.title,
            ...(subtasks.length > 0 ? { subtasks } : {}),
        };

        const promise = createTask.mutateAsync(payload);

        toast.promise(promise, {
            loading: "Menambahkan tugas...",
            success: () => {
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                form.reset();
                setSubtasks([]);
                setSubtaskInput("");
                setShowSubtasks(false);
                return subtasks.length > 0
                    ? `Tugas dan ${subtasks.length} sub-tugas berhasil ditambahkan`
                    : "Tugas berhasil ditambahkan";
            },
            error: (error) => {
                return error.message;
            },
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="border-b border-border pb-5 space-y-2.5">
            <div className="flex items-start gap-2">
                <Controller
                    control={form.control}
                    name="title"
                    render={({ field, fieldState }) => (
                        <Field className="flex-1" data-invalid={fieldState.invalid}>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                type="text"
                                placeholder="Tambahkan tugas baru (contoh: Manajemen)..."
                                disabled={createTask.isPending}
                                className="w-full"
                            />

                            {fieldState.error && (
                                <FieldError className="text-xs" errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Button
                    type="submit"
                    disabled={createTask.isPending}
                    size="default"
                    className="shrink-0 gap-1.5 cursor-pointer"
                >
                    {createTask.isPending ? (
                        <Spinner className="size-4" />
                    ) : (
                        <RiAddLine className="size-4" />
                    )}
                    <span>Tambah</span>
                </Button>
            </div>

            {/* Toggle to add initial subtasks */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setShowSubtasks((prev) => !prev)}
                    className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors px-1 py-0.5 rounded-md",
                        showSubtasks
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <RiGitBranchLine className="size-3.5" />
                    <span>
                        {showSubtasks ? "Tutup Sub-tugas awal" : "+ Tambah Sub-tugas awal (opsional)"}
                    </span>
                    {subtasks.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-primary/15 text-primary font-bold">
                            {subtasks.length}
                        </span>
                    )}
                    {showSubtasks ? (
                        <RiArrowUpSLine className="size-3.5" />
                    ) : (
                        <RiArrowDownSLine className="size-3.5" />
                    )}
                </button>
            </div>

            {/* Collapsible Subtask Entry in Form */}
            {showSubtasks && (
                <div className="p-2.5 rounded-xl bg-muted/30 border border-border/70 space-y-2 animate-in fade-in duration-200">
                    <p className="text-[11px] text-muted-foreground">
                        Tambahkan sub-tugas (contoh: BAB I, BAB II, BAB III) sebelum membuat tugas:
                    </p>

                    <div className="flex items-center gap-1.5">
                        <Input
                            type="text"
                            value={subtaskInput}
                            onChange={(e) => setSubtaskInput(e.target.value)}
                            onKeyDown={handleSubtaskKeyDown}
                            placeholder="Ketik sub-tugas lalu tekan Enter..."
                            className="h-8 text-xs bg-background"
                        />
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={handleAddSubtaskChip}
                            disabled={!subtaskInput.trim()}
                            className="h-8 text-xs gap-1 shrink-0 cursor-pointer"
                        >
                            <RiAddLine className="size-3.5" />
                            Tambah
                        </Button>
                    </div>

                    {/* Subtask Chips */}
                    {subtasks.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {subtasks.map((st, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-card border border-border text-foreground shadow-2xs"
                                >
                                    <span>{st}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSubtaskChip(idx)}
                                        className="text-muted-foreground hover:text-destructive cursor-pointer"
                                    >
                                        <RiCloseLine className="size-3.5" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </form>
    );
}
