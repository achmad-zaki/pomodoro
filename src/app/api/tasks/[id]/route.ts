import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import z from "zod";

const createTashSchema = z.object({
    title: z.string().min(1, {
        message: "Judul task harus diisi"
    }).max(255, {
        message: "Judul task tidak boleh lebih dari 255 karakter"
    }),
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

        const validated = createTashSchema.safeParse(body);

        if (!validated.success) {
            return Response.json(validated.error.flatten().fieldErrors, { status: 400 });
        }

        const updateTask = await prisma.task.update({
            where: {
                id
            },
            data: {
                title: validated.data.title,
            }
        });

        return Response.json({
            message: "Tugas berhasil diubah",
            data: updateTask
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