import { GetSettingResponse } from "../types/setting.type";

export const getSetting = async (): Promise<GetSettingResponse> => {
    const response = await fetch("/api/settings", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan saat mengambil pengaturan");
    }

    return data as GetSettingResponse;
};
