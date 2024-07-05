import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteTaskById } from "@/services/task.service"
import { Trash2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

type DeleteTaskProps = {
  taskId: string
  deleteTask: (taskId: string) => void
}

export const DeleteTask = ({ taskId, deleteTask }: DeleteTaskProps) => {
  const [isPending, startDeleteTaskTransition] = useTransition();

  async function handleDeleteTask() {
    startDeleteTaskTransition(() => {
      toast.promise(
        deleteTaskById(taskId, deleteTask),
        {
          loading: "Deleting task",
          success: "Task deleted",
          error: "Failed deleting task",
        },
      );
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="flex items-center gap-1 hover:text-red-500 cursor-pointer">
          <p className="text-sm ">
            Delete
          </p><Trash2 size={16} />
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this task.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteTask}
          >
            Confirm Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
