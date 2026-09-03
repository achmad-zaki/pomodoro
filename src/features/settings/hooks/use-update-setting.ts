import { useMutation } from "@tanstack/react-query";
import { updateSetting } from "../services/update-setting";
import { UpdateSettingPayload } from "../types/setting.type";

export const useUpdateSetting = () => {
  return useMutation({
    mutationFn: (payload: UpdateSettingPayload) => updateSetting(payload),
  });
};
