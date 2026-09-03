export type Task = {
    id: string
    title: string
    completed: boolean
    isFocused: boolean
    createdAt?: string
    updatedAt?: string
}

export type GetTasksResponse = {
    message: string
    data: Task[]
}

export type CreateTaskResponse = {
    message: string
    data: Task
}

export type UpdateTaskResponse = {
    message: string
    data: Task
}