import { useMutation } from "@tanstack/react-query";
import { deleteTask } from "../services/delete-task";

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
  });
};
