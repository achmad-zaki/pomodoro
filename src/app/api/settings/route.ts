import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const settingsSchema = z.object({
    focusDuration: z
        .number()
        .int("Durasi fokus harus berupa bilangan bulat")
        .min(1, "Durasi fokus minimal 1 menit")
        .max(180, "Durasi fokus maksimal 180 menit")
        .optional(),
    shortBreakDuration: z
        .number()
        .int("Durasi istirahat pendek harus berupa bilangan bulat")
        .min(1, "Durasi istirahat pendek minimal 1 menit")
        .max(60, "Durasi istirahat pendek maksimal 60 menit")
        .optional(),
    longBreakDuration: z
        .number()
        .int("Durasi istirahat panjang harus berupa bilangan bulat")
        .min(1, "Durasi istirahat panjang minimal 1 menit")
        .max(90, "Durasi istirahat panjang maksimal 90 menit")
        .optional(),
    sessionsBeforeLongBreak: z
        .number()
        .int("Jumlah sesi harus berupa bilangan bulat")
        .min(1, "Jumlah sesi sebelum istirahat panjang minimal 1")
        .max(20, "Jumlah sesi sebelum istirahat panjang maksimal 20")
        .optional(),
    autoStartBreak: z.boolean().optional(),
    autoStartFocus: z.boolean().optional(),
});

export async function GET() {
    try {
        let setting = await prisma.pomodoroSetting.findFirst();

        if (!setting) {
            setting = await prisma.pomodoroSetting.create({
                data: {},
            });
        }

        return NextResponse.json(
            {
                success: true,
                data: setting,
            },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Terjadi kesalahan pada server",
            },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();

        const validated = settingsSchema.safeParse(body);

        if (!validated.success) {
            const firstErrorMessage =
                validated.error.issues[0]?.message || "Data tidak valid";
            return NextResponse.json(
                {
                    success: false,
                    message: firstErrorMessage,
                    error: validated.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const existingSetting = await prisma.pomodoroSetting.findFirst();

        let setting;
        if (existingSetting) {
            setting = await prisma.pomodoroSetting.update({
                where: {
                    id: existingSetting.id,
                },
                data: validated.data,
            });
        } else {
            setting = await prisma.pomodoroSetting.create({
                data: validated.data,
            });
        }

        return NextResponse.json(
            {
                success: true,
                message: "Pengaturan berhasil diperbarui",
                data: setting,
            },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Terjadi kesalahan pada server",
            },
            { status: 500 }
        );
    }
}