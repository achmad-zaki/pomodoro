"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { RiListCheck3 } from "@remixicon/react"
import TaskForm from "./task-form"
import { TaskList } from "./task-list"

export default function TaskSheet() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="lg" variant="secondary">
                    <RiListCheck3 />
                    Tugas
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Daftar Tugas</SheetTitle>
                    <SheetDescription>Kelola target & fokus Kamu</SheetDescription>
                </SheetHeader>

                <div className="p-4 flex flex-col gap-10">
                    <TaskForm />
                    <TaskList />
                </div>
            </SheetContent>
        </Sheet>
    )
}
