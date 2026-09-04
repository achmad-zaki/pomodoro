import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import z from "zod";

const updateSubTaskSchema = z.object({
    title: z.string().min(1, {
        message: "Judul sub-tugas harus diisi"
    }).max(255, {
        message: "Judul sub-tugas tidak boleh lebih dari 255 karakter"
    }).optional(),
    completed: z.boolean().optional(),
});

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
    try {
        const { id, subtaskId } = await params;
        const body = await req.json();

        const existSubtask = await prisma.subTask.findFirst({
            where: {
                id: subtaskId,
                taskId: id,
            },
        });

        if (!existSubtask) {
            return Response.json(
                {
                    success: false,
                    message: "Sub-tugas tidak ditemukan",
                },
                { status: 404 }
            );
        }

        const validated = updateSubTaskSchema.safeParse(body);

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

        const updatedSubTask = await prisma.subTask.update({
            where: {
                id: subtaskId,
            },
            data: {
                ...(validated.data.title !== undefined
                    ? { title: validated.data.title.trim() }
                    : {}),
                ...(validated.data.completed !== undefined
                    ? { completed: validated.data.completed }
                    : {}),
            },
        });

        // If completed status was changed, evaluate parent task completion
        if (validated.data.completed !== undefined) {
            const allSubtasks = await prisma.subTask.findMany({
                where: { taskId: id },
            });

            const allCompleted = allSubtasks.every((st) => st.completed);

            if (allCompleted) {
                await prisma.task.update({
                    where: { id },
                    data: { completed: true, isFocused: false },
                });
            } else {
                await prisma.task.update({
                    where: { id },
                    data: { completed: false },
                });
            }
        }

        return Response.json(
            {
                message: "Sub-tugas berhasil diubah",
                data: updatedSubTask,
            },
            { status: 200 }
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

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
    try {
        const { id, subtaskId } = await params;

        const existSubtask = await prisma.subTask.findFirst({
            where: {
                id: subtaskId,
                taskId: id,
            },
        });

        if (!existSubtask) {
            return Response.json(
                {
                    success: false,
                    message: "Sub-tugas tidak ditemukan",
                },
                { status: 404 }
            );
        }

        await prisma.subTask.delete({
            where: {
                id: subtaskId,
            },
        });

        // After deleting, check remaining subtasks
        const remainingSubtasks = await prisma.subTask.findMany({
            where: { taskId: id },
        });

        if (remainingSubtasks.length > 0) {
            const allCompleted = remainingSubtasks.every((st) => st.completed);
            await prisma.task.update({
                where: { id },
                data: { completed: allCompleted },
            });
        }

        return Response.json(
            {
                success: true,
                message: "Sub-tugas berhasil dihapus",
            },
            { status: 200 }
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
