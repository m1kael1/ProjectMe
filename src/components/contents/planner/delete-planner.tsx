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
import { client } from "@/db/client"
import { plannerStore } from "@/store/planner-store"
import { Trash2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"
import { useStore } from "zustand"

type DeletePlannerProps = {
  plannerId: string
  setIsOpened: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

export const DeletePlanner = ({ setIsOpened, plannerId }: DeletePlannerProps) => {
  const [isPending, startDeletePlannerTransition] = useTransition();
  const { deletePlanner } = useStore(plannerStore);

  async function handleDeletePlanner() {
    startDeletePlannerTransition(() => {
      toast.promise(
        client.collection("planners").delete(plannerId).then((res) => {
          deletePlanner(plannerId)
        }),
        {
          loading: "Deleting planner",
          success: "Planner deleted",
          error: "Failed deleting planner",
        },
      );
    });
    setTimeout(() => {
      setIsOpened(false);
    }, 1000);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Remove
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this planner.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeletePlanner}
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog >
  )
}
