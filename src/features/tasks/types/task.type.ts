export type Task = {
    id: string
    title: string
    completed: boolean
    isFocus: boolean
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