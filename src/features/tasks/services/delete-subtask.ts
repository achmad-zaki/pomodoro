import { DeleteSubTaskPayload } from "../types/task.type";

export const deleteSubTask = async ({
  taskId,
  subtaskId,
}: DeleteSubTaskPayload): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal menghapus sub-tugas");
  }

  return data;
};
