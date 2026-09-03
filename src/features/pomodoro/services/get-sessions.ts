import {
  GetSessionsParams,
  SessionsResponse,
} from "../types/session.type";

export const getSessions = async (
  params?: GetSessionsParams
): Promise<SessionsResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.type) searchParams.set("type", params.type);
  if (params?.taskId) searchParams.set("taskId", params.taskId);
  if (params?.startDate) searchParams.set("startDate", params.startDate);
  if (params?.endDate) searchParams.set("endDate", params.endDate);
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/api/sessions?${queryString}` : "/api/sessions";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil daftar sesi Pomodoro");
  }

  return data as SessionsResponse;
};
