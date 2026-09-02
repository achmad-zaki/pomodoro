"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiAddLine } from "@remixicon/react";
import { useForm } from "react-hook-form";
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
    const { mutate: addTask, isPending } = useCreateTask();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TaskFormData>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
        },
    });

    const onSubmit = (data: TaskFormData) => {
        addTask(data.title.trim(), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1.5 mb-4">
            <div className="flex items-center gap-2">
                <Input
                    {...register("title")}
                    type="text"
                    placeholder="Tambahkan tugas baru..."
                    disabled={isPending}
                    className="flex-1"
                />
                <Button
                    type="submit"
                    disabled={isPending}
                    size="default"
                    variant="3d"
                    className="shrink-0 gap-1.5 cursor-pointer"
                >
                    {isPending ? (
                        <Spinner className="size-4" />
                    ) : (
                        <RiAddLine className="size-4" />
                    )}
                    <span>Tambah</span>
                </Button>
            </div>
            {errors.title?.message && (
                <p className="text-xs text-destructive font-medium px-1">
                    {errors.title.message}
                </p>
            )}
        </form>
    );
}
