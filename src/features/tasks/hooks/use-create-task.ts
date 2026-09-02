import { useMutation } from "@tanstack/react-query";
import { createTask } from "../services/create-task";

export const useCreateTask = () => {

  return useMutation({
    mutationFn: (title: string) => createTask(title),
  });
};
