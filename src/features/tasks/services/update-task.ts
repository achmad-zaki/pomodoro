import { Task } from "../types/task.type";

export type UpdateTaskPayload = {
  title?: string;
  completed?: boolean;
};

export const updateTask = async (
  id: string,
  payload: UpdateTaskPayload
): Promise<{ message: string; data: Task }> => {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Terjadi kesalahan saat memperbarui tugas");
  }

  return response.json();
};
