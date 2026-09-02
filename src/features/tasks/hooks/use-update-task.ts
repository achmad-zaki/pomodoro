import { useMutation } from "@tanstack/react-query";
import { updateTask, UpdateTaskPayload } from "../services/update-task";

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) =>
      updateTask(id, payload),
  });
};

