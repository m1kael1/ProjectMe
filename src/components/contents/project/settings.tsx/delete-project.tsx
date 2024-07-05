'use client'

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
import { Button } from "@/components/ui/button"
import { deleteProject } from "@/services/project.service"
import { Trash2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

type DeleteProjectProps = {
  projectId: string
}

export const DeleteProject = ({ projectId }: DeleteProjectProps) => {
  const [isPending, startDeleteProjectTransition] = useTransition();

  async function handleDeleteTask() {
    startDeleteProjectTransition(() => {
      toast.promise(
        deleteProject(projectId),
        {
          loading: "Deleting project",
          success: "Project deleted",
          error: "Failed deleting project",
        },
      );
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          Delete
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this project.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteTask}
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog >
  )
}
