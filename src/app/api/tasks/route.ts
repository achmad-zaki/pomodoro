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

export async function GET() {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        return Response.json({
            success: true,
            data: tasks
        }, { status: 200 });
    } catch {
        return Response.json({
            message: "Terjadi kesalahan pada server"
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const validated = createTashSchema.safeParse(body);

        if (!validated.success) {
            return Response.json(validated.error.flatten().fieldErrors, { status: 400 });
        }

        const task = await prisma.task.create({
            data: {
                title: validated.data.title,
            }
        });

        return Response.json({
            message: "Tugas berhasil dibuat",
            data: task
        }, { status: 201 });
    } catch {
        return Response.json({
            message: "Terjadi kesalahan pada server"
        }, { status: 500 });
    }
}