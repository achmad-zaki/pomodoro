"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { RiListCheck3 } from "@remixicon/react"
import { useGetTask } from "../hooks/use-get-task"
import TaskForm from "./task-form"
import { TaskList } from "./task-list"

export default function TaskSheet() {
    const { data: tasksResponse } = useGetTask()
    const totalCount = tasksResponse?.data?.length || 0
    const completedCount = tasksResponse?.data?.filter((t) => t.completed).length || 0

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="lg" variant="secondary" className="cursor-pointer">
                    <RiListCheck3 />
                    Tugas
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col h-full overflow-hidden">
                <SheetHeader className="p-6 shrink-0">
                    <SheetTitle>Daftar Tugas</SheetTitle>
                    <SheetDescription>Kelola target & fokus Kamu</SheetDescription>
                </SheetHeader>

                <div className="p-6 flex-1 min-h-0 flex flex-col gap-6 overflow-hidden">
                    <TaskForm />
                    <TaskList />
                </div>

                <SheetFooter className="p-4 px-6 border-t border-border mt-auto flex flex-row items-center justify-between text-xs text-muted-foreground bg-muted/20 shrink-0">
                    <span>Total Tugas: <strong className="text-foreground font-semibold">{totalCount}</strong></span>
                    <span>Selesai: <strong className="text-emerald-600 font-semibold">{completedCount}</strong></span>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
