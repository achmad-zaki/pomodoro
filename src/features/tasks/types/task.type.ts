export type SubTask = {
    id: string
    title: string
    completed: boolean
    taskId: string
    createdAt?: string
    updatedAt?: string
}

export type Task = {
    id: string
    title: string
    completed: boolean
    isFocused: boolean
    subtasks?: SubTask[]
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

export type CreateTaskPayload = {
    title: string
    subtasks?: string[]
}

export type CreateSubTaskPayload = {
    taskId: string
    title: string
}

export type UpdateSubTaskPayload = {
    taskId: string
    subtaskId: string
    payload: {
        title?: string
        completed?: boolean
    }
}

export type DeleteSubTaskPayload = {
    taskId: string
    subtaskId: string
}

export type SubTaskResponse = {
    message: string
    data: SubTask
}