import { useMutation } from "@tanstack/react-query";
import { deleteSubTask } from "../services/delete-subtask";
import { DeleteSubTaskPayload } from "../types/task.type";

export const useDeleteSubTask = () => {
  return useMutation({
    mutationFn: (payload: DeleteSubTaskPayload) => deleteSubTask(payload),
  });
};
