import { UpdateSettingPayload, UpdateSettingResponse } from "../types/setting.type";

export const updateSetting = async (
    payload: UpdateSettingPayload
): Promise<UpdateSettingResponse> => {
    const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Gagal memperbarui pengaturan");
    }

    return data as UpdateSettingResponse;
};
