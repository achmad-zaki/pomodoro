import { useQuery } from "@tanstack/react-query"
import { getAllTask } from "../services/get-all-task"

export const useGetTask = () => {
    return useQuery({
        queryKey: ["tasks"],
        queryFn: getAllTask
    })
}