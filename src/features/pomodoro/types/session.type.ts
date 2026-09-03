import { PomodoroSessionType } from "@/generated/prisma/enums";

export type { PomodoroSessionType };

export interface SessionTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface PomodoroSession {
  id: string;
  type: PomodoroSessionType;
  duration: number;
  completedAt: string | Date;
  taskId: string | null;
  task?: SessionTask | null;
  createdAt: string | Date;
}

export interface CreateSessionPayload {
  type: PomodoroSessionType;
  duration: number;
  taskId?: string | null;
  completedAt?: string | Date;
}

export interface GetSessionsParams {
  type?: PomodoroSessionType;
  taskId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface SessionPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SessionsResponse {
  success: boolean;
  data: PomodoroSession[];
  pagination: SessionPagination;
}

export interface SessionDetailResponse {
  success: boolean;
  data: PomodoroSession;
}

export interface CreateSessionResponse {
  success: boolean;
  message: string;
  data: PomodoroSession;
}

export interface DeleteSessionResponse {
  success: boolean;
  message: string;
}

export interface SessionStats {
  today: {
    focusSessionsCount: number;
    focusDuration: number;
    breakSessionsCount: number;
    breakDuration: number;
  };
  allTime: {
    totalSessions: number;
    totalDuration: number;
    byType: Record<
      PomodoroSessionType,
      {
        count: number;
        totalDuration: number;
      }
    >;
  };
}

export interface SessionStatsResponse {
  success: boolean;
  data: SessionStats;
}
