import { useQuery } from "@tanstack/react-query";
import { getSessions } from "../services/get-sessions";
import { GetSessionsParams } from "../types/session.type";

export const useGetSessions = (params?: GetSessionsParams) => {
  return useQuery({
    queryKey: ["sessions", params],
    queryFn: () => getSessions(params),
  });
};
