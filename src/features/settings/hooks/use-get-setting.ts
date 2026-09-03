import { useQuery } from "@tanstack/react-query";
import { getSetting } from "../services/get-setting";

export const useGetSetting = () => {
    return useQuery({
        queryKey: ["settings"],
        queryFn: getSetting,
    });
};
