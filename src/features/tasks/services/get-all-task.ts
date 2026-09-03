import { GetTasksResponse } from "../types/task.type"

export const getAllTask = async (): Promise<GetTasksResponse> => {
    const response = await fetch('/api/tasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || "Terjadi Kesalahan saat Mengambil Data");
    }
    return data as GetTasksResponse;
}