import {
  CreateSessionPayload,
  CreateSessionResponse,
} from "../types/session.type";

export const createSession = async (
  payload: CreateSessionPayload
): Promise<CreateSessionResponse> => {
  const response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Gagal mencatat sesi Pomodoro");
  }

  return data as CreateSessionResponse;
};
