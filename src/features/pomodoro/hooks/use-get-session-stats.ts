import { useQuery } from "@tanstack/react-query";
import { getSessionStats } from "../services/get-session-stats";

export const useGetSessionStats = () => {
  return useQuery({
    queryKey: ["session-stats"],
    queryFn: getSessionStats,
  });
};
