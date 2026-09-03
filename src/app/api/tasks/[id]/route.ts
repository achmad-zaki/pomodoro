import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import z from "zod";

const updateTaskSchema = z.object({
    title: z.string().min(1, {
        message: "Judul task harus diisi"
    }).max(255, {
        message: "Judul task tidak boleh lebih dari 255 karakter"
    }).optional(),
    completed: z.boolean().optional(),
    isFocused: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const body = await req.json();

        const existTask = await prisma.task.findUnique({
            where: {
                id
            }
        });

        if (!existTask) {
            return Response.json({
                success: false,
                message: "Tugas tidak ditemukan"
            }, { status: 404 });
        }

        const validated = updateTaskSchema.safeParse(body);

        if (!validated.success) {
            return Response.json({
                success: false,
                message: "Validation failed",
                error: validated.error.flatten().fieldErrors,
            }, { status: 400 });
        }

        // If this task is marked as focused, reset isFocused on other tasks
        if (validated.data.isFocused === true) {
            await prisma.task.updateMany({
                where: {
                    id: { not: id },
                    isFocused: true,
                },
                data: {
                    isFocused: false,
                },
            });
        }

        const updateData: Prisma.TaskUpdateInput = {};

        if (validated.data.title !== undefined) {
            updateData.title = validated.data.title;
        }

        if (validated.data.completed !== undefined) {
            updateData.completed = validated.data.completed;
        }

        if (validated.data.isFocused !== undefined) {
            updateData.isFocused = validated.data.isFocused;
        }

        if (
            validated.data.completed === true &&
            validated.data.isFocused === undefined
        ) {
            updateData.isFocused = false;
        }

        const updatedTask = await prisma.task.update({
            where: {
                id,
            },
            data: updateData,
        });

        return Response.json({
            message: "Tugas berhasil diubah",
            data: updatedTask
        }, { status: 200 });
    } catch {
        return Response.json({
            message: "Terjadi kesalahan pada server"
        }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const existTask = await prisma.task.findUnique({
            where: {
                id
            }
        });

        if (!existTask) {
            return Response.json({
                success: false,
                message: "Tugas tidak ditemukan"
            }, { status: 404 });
        }

        await prisma.task.delete({
            where: {
                id
            }
        });

        return Response.json({
            success: true,
            message: "Tugas berhasil dihapus",
        }, { status: 200 });
    } catch {
        return Response.json({
            message: "Terjadi kesalahan pada server"
        }, { status: 500 });
    }
}