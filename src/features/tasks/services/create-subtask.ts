import { CreateSubTaskPayload, SubTaskResponse } from "../types/task.type";

export const createSubTask = async ({
  taskId,
  title,
}: CreateSubTaskPayload): Promise<SubTaskResponse> => {
  const response = await fetch(`/api/tasks/${taskId}/subtasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal menambahkan sub-tugas");
  }

  return data;
};
