import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import z from "zod";

const createTaskSchema = z.object({
    title: z.string().min(1, {
        message: "Judul task harus diisi"
    }).max(255, {
        message: "Judul task tidak boleh lebih dari 255 karakter"
    }),
    subtasks: z.array(
        z.string().min(1, {
            message: "Judul sub-tugas tidak boleh kosong"
        }).max(255, {
            message: "Judul sub-tugas tidak boleh lebih dari 255 karakter"
        })
    ).optional(),
});

export async function GET() {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                subtasks: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return Response.json({
            success: true,
            data: tasks
        }, { status: 200 });
    } catch (error) {
        console.error("GET /api/tasks error:", error);
        return Response.json({
            message: "Terjadi kesalahan pada server",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const validated = createTaskSchema.safeParse(body);

        if (!validated.success) {
            const firstErrorMessage =
                validated.error.issues[0]?.message || "Data tidak valid";
            return Response.json({
                success: false,
                message: firstErrorMessage,
                error: validated.error.flatten().fieldErrors,
            }, { status: 400 });
        }

        const filteredSubtasks =
            validated.data.subtasks
                ?.map((s) => s.trim())
                .filter((s) => s.length > 0) || [];

        const task = await prisma.task.create({
            data: {
                title: validated.data.title,
                ...(filteredSubtasks.length > 0
                    ? {
                        subtasks: {
                            create: filteredSubtasks.map((stTitle) => ({
                                title: stTitle,
                            })),
                        },
                    }
                    : {}),
            },
            include: {
                subtasks: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });

        return Response.json({
            message: "Tugas berhasil dibuat",
            data: task
        }, { status: 201 });
    } catch (error) {
        console.error("POST /api/tasks error:", error);
        return Response.json({
            message: "Terjadi kesalahan pada server",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}