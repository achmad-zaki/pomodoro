"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiAddLine } from "@remixicon/react";
import { Controller, useForm } from "react-hook-form";
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

    const form = useForm<TaskFormData>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
        },
    });

    const onSubmit = (data: TaskFormData) => {
        addTask(data.title.trim(), {
            onSuccess: () => {
                form.reset();
            },
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                placeholder="Tambahkan tugas baru..."
                                disabled={isPending}
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
        </form>
    );
}
