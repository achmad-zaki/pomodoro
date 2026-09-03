import prisma from "@/lib/prisma";
import { PomodoroSessionType } from "@/generated/prisma/enums";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      todayFocus,
      todayBreak,
      allFocus,
      allShortBreak,
      allLongBreak,
      totalCount,
    ] = await prisma.$transaction([
      prisma.pomodoroSession.aggregate({
        where: {
          type: PomodoroSessionType.FOCUS,
          completedAt: {
            gte: startOfToday,
          },
        },
        _count: {
          _all: true,
        },
        _sum: {
          duration: true,
        },
      }),
      prisma.pomodoroSession.aggregate({
        where: {
          type: {
            in: [PomodoroSessionType.SHORT_BREAK, PomodoroSessionType.LONG_BREAK],
          },
          completedAt: {
            gte: startOfToday,
          },
        },
        _count: {
          _all: true,
        },
        _sum: {
          duration: true,
        },
      }),
      prisma.pomodoroSession.aggregate({
        where: {
          type: PomodoroSessionType.FOCUS,
        },
        _count: {
          _all: true,
        },
        _sum: {
          duration: true,
        },
      }),
      prisma.pomodoroSession.aggregate({
        where: {
          type: PomodoroSessionType.SHORT_BREAK,
        },
        _count: {
          _all: true,
        },
        _sum: {
          duration: true,
        },
      }),
      prisma.pomodoroSession.aggregate({
        where: {
          type: PomodoroSessionType.LONG_BREAK,
        },
        _count: {
          _all: true,
        },
        _sum: {
          duration: true,
        },
      }),
      prisma.pomodoroSession.count(),
    ]);

    const byType = {
      FOCUS: {
        count: allFocus._count._all,
        totalDuration: allFocus._sum.duration || 0,
      },
      SHORT_BREAK: {
        count: allShortBreak._count._all,
        totalDuration: allShortBreak._sum.duration || 0,
      },
      LONG_BREAK: {
        count: allLongBreak._count._all,
        totalDuration: allLongBreak._sum.duration || 0,
      },
    };

    const totalDuration =
      (allFocus._sum.duration || 0) +
      (allShortBreak._sum.duration || 0) +
      (allLongBreak._sum.duration || 0);

    return NextResponse.json(
      {
        success: true,
        data: {
          today: {
            focusSessionsCount: todayFocus._count._all,
            focusDuration: todayFocus._sum.duration || 0,
            breakSessionsCount: todayBreak._count._all,
            breakDuration: todayBreak._sum.duration || 0,
          },
          allTime: {
            totalSessions: totalCount,
            totalDuration,
            byType,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching session statistics:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}
