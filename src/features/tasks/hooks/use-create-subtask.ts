import { useMutation } from "@tanstack/react-query";
import { createSubTask } from "../services/create-subtask";
import { CreateSubTaskPayload } from "../types/task.type";

export const useCreateSubTask = () => {
  return useMutation({
    mutationFn: (payload: CreateSubTaskPayload) => createSubTask(payload),
  });
};
