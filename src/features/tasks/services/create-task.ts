import { CreateTaskResponse } from "../types/task.type";

export const createTask = async (title: string): Promise<CreateTaskResponse> => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal menambahkan tugas");
  }

  return data;
};
