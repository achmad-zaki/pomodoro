import { CreateTaskPayload, CreateTaskResponse } from "../types/task.type";

export const createTask = async (
  payload: string | CreateTaskPayload
): Promise<CreateTaskResponse> => {
  const body = typeof payload === "string" ? { title: payload } : payload;

  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal menambahkan tugas");
  }

  return data;
};
