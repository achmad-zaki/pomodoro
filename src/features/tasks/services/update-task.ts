import { UpdateTaskResponse } from "../types/task.type";

export type UpdateTaskPayload = {
  title?: string;
  completed?: boolean;
};

export const updateTask = async (
  id: string,
  payload: UpdateTaskPayload
): Promise<UpdateTaskResponse> => {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal memperbarui tugas");
  }

  return data;
};
