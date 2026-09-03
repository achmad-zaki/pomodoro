import { Prisma } from "@/generated/prisma/client";
import { PomodoroSessionType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createSessionSchema = z.object({
  type: z.enum(
    [
      PomodoroSessionType.FOCUS,
      PomodoroSessionType.SHORT_BREAK,
      PomodoroSessionType.LONG_BREAK,
    ],
    {
      message: "Tipe sesi harus FOCUS, SHORT_BREAK, atau LONG_BREAK",
    }
  ),
  duration: z
    .number()
    .int("Durasi harus berupa bilangan bulat")
    .positive("Durasi harus lebih besar dari 0"),
  taskId: z.string().nullable().optional(),
  completedAt: z.coerce.date().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const typeParam = searchParams.get("type");
    const taskIdParam = searchParams.get("taskId");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "50", 10);

    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
    const limit = Math.min(100, Math.max(1, isNaN(limitParam) ? 50 : limitParam));

    const where: Prisma.PomodoroSessionWhereInput = {};

    if (
      typeParam &&
      Object.values(PomodoroSessionType).includes(typeParam as PomodoroSessionType)
    ) {
      where.type = typeParam as PomodoroSessionType;
    }

    if (taskIdParam !== null && taskIdParam !== undefined && taskIdParam.trim() !== "") {
      where.taskId = taskIdParam;
    }

    if (startDateParam || endDateParam) {
      where.completedAt = {};
      if (startDateParam) {
        const start = new Date(startDateParam);
        if (!isNaN(start.getTime())) {
          where.completedAt.gte = start;
        }
      }
      if (endDateParam) {
        const end = new Date(endDateParam);
        if (!isNaN(end.getTime())) {
          where.completedAt.lte = end;
        }
      }
    }

    const [total, sessions] = await prisma.$transaction([
      prisma.pomodoroSession.count({ where }),
      prisma.pomodoroSession.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          completedAt: "desc",
        },
        include: {
          task: {
            select: {
              id: true,
              title: true,
              completed: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: sessions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching pomodoro sessions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validated = createSessionSchema.safeParse(body);

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

    const { type, duration, taskId, completedAt } = validated.data;

    // Validate taskId if provided
    if (taskId && taskId.trim() !== "") {
      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!existingTask) {
        return NextResponse.json(
          {
            success: false,
            message: "Tugas yang dipilih tidak ditemukan",
          },
          { status: 404 }
        );
      }
    }

    const normalizedTaskId = taskId && taskId.trim() !== "" ? taskId : null;

    // Idempotency guard: prevent duplicate sessions created within 3 seconds
    const threeSecondsAgo = new Date(Date.now() - 3000);
    const existingRecentSession = await prisma.pomodoroSession.findFirst({
      where: {
        type,
        duration,
        taskId: normalizedTaskId,
        createdAt: {
          gte: threeSecondsAgo,
        },
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            completed: true,
          },
        },
      },
    });

    if (existingRecentSession) {
      return NextResponse.json(
        {
          success: true,
          message: "Sesi Pomodoro berhasil dicatat",
          data: existingRecentSession,
        },
        { status: 200 }
      );
    }

    const session = await prisma.pomodoroSession.create({
      data: {
        type,
        duration,
        taskId: normalizedTaskId,
        completedAt: completedAt || new Date(),
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            completed: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Sesi Pomodoro berhasil dicatat",
        data: session,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating pomodoro session:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}
