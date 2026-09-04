import { useMutation } from "@tanstack/react-query";
import { updateSubTask } from "../services/update-subtask";
import { UpdateSubTaskPayload } from "../types/task.type";

export const useUpdateSubTask = () => {
  return useMutation({
    mutationFn: (payload: UpdateSubTaskPayload) => updateSubTask(payload),
  });
};
