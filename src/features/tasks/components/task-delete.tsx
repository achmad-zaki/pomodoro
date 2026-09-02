import { Button } from "@/components/ui/button";
import { RiDeleteBin6Line } from "@remixicon/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDeleteTask } from "../hooks/use-delete-task";

export default function TaskDelete({ taskId }: { taskId: string }) {
    const deleteTask = useDeleteTask()
    const queryClient = useQueryClient()

    const handleDelete = () => {
        const promise = deleteTask.mutateAsync(taskId);

        toast.promise(promise, {
            loading: "Menghapus tugas...",
            success: () => {
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                return "Tugas berhasil dihapus"
            },
            error: (error) => {
                return error.message
            },
        });
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleDelete}
            title="Hapus tugas"
            className="rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
        >
            <RiDeleteBin6Line className="size-3.5" />
        </Button>
    )
}
