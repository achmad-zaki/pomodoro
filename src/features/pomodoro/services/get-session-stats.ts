import { SessionStatsResponse } from "../types/session.type";

export const getSessionStats = async (): Promise<SessionStatsResponse> => {
  const response = await fetch("/api/sessions/stats", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil statistik sesi");
  }

  return data as SessionStatsResponse;
};
