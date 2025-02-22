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
import { projectStore } from "@/store/project-store"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import { useStore } from "zustand"

type DeleteProjectProps = {
  projectId: string
}

export const DeleteProject = ({ projectId }: DeleteProjectProps) => {
  const [isPending, startDeleteProjectTransition] = useTransition();
  const { deleteProject: removeProject } = useStore(projectStore)
  const router = useRouter()

  async function handleDeleteTask() {
    startDeleteProjectTransition(() => {
      toast.promise(
        deleteProject(projectId, removeProject),
        {
          loading: "Deleting project",
          success: "Project deleted",
          error: "Failed deleting project",
        },
      );
      setTimeout(() => {
        router.push("/projects")
      }, 1000);
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
