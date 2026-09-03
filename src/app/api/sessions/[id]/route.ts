import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await prisma.pomodoroSession.findUnique({
      where: { id },
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

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Sesi Pomodoro tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: session,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching session detail:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await prisma.pomodoroSession.findUnique({
      where: { id },
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Sesi Pomodoro tidak ditemukan",
        },
        { status: 404 }
      );
    }

    await prisma.pomodoroSession.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Sesi Pomodoro berhasil dihapus",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting pomodoro session:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}
