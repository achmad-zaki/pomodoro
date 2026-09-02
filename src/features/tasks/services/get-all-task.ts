import { GetTasksResponse } from "../types/task.type"

export const getAllTask = async (): Promise<GetTasksResponse> => {
    const response = await fetch('/api/tasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    if (!response.ok) {
        throw new Error("Terjadi Kesalahan saat Mengambil Data")
    }
    const data: GetTasksResponse = await response.json()
    return data
}