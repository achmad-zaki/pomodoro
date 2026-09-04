import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import z from "zod";

const createSubTaskSchema = z.object({
    title: z.string().min(1, {
        message: "Judul sub-tugas harus diisi"
    }).max(255, {
        message: "Judul sub-tugas tidak boleh lebih dari 255 karakter"
    }),
});

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        const existTask = await prisma.task.findUnique({
            where: { id },
        });

        if (!existTask) {
            return Response.json(
                {
                    success: false,
                    message: "Tugas tidak ditemukan",
                },
                { status: 404 }
            );
        }

        const validated = createSubTaskSchema.safeParse(body);

        if (!validated.success) {
            const firstErrorMessage =
                validated.error.issues[0]?.message || "Data tidak valid";
            return Response.json(
                {
                    success: false,
                    message: firstErrorMessage,
                    error: validated.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const subtask = await prisma.subTask.create({
            data: {
                title: validated.data.title.trim(),
                taskId: id,
                completed: false,
            },
        });

        // If the task was previously marked completed, uncheck it since a new unfinished subtask was added
        if (existTask.completed) {
            await prisma.task.update({
                where: { id },
                data: { completed: false },
            });
        }

        return Response.json(
            {
                message: "Sub-tugas berhasil dibuat",
                data: subtask,
            },
            { status: 201 }
        );
    } catch {
        return Response.json(
            {
                message: "Terjadi kesalahan pada server",
            },
            { status: 500 }
        );
    }
}
