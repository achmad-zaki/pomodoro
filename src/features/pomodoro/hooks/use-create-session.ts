import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession } from "../services/create-session";
import { CreateSessionPayload } from "../types/session.type";

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSessionPayload) => createSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session-stats"] });
    },
  });
};
