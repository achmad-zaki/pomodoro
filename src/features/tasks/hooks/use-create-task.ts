import { useMutation } from "@tanstack/react-query";
import { createTask } from "../services/create-task";
import { CreateTaskPayload } from "../types/task.type";

export const useCreateTask = () => {
  return useMutation({
    mutationFn: (payload: string | CreateTaskPayload) => createTask(payload),
  });
};
