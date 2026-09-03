import { DeleteSessionResponse } from "../types/session.type";

export const deleteSession = async (
  id: string
): Promise<DeleteSessionResponse> => {
  const response = await fetch(`/api/sessions/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Gagal menghapus sesi Pomodoro");
  }

  return data as DeleteSessionResponse;
};
