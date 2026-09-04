import { SubTaskResponse, UpdateSubTaskPayload } from "../types/task.type";

export const updateSubTask = async ({
  taskId,
  subtaskId,
  payload,
}: UpdateSubTaskPayload): Promise<SubTaskResponse> => {
  const response = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal memperbarui sub-tugas");
  }

  return data;
};
