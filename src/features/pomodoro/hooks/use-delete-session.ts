import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSession } from "../services/delete-session";

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session-stats"] });
    },
  });
};
