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
import { deleteDiscussionById } from "@/services/discussion.service"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

type DeleteTopicDiscussionProps = {
  discussionId: string
  setIsOpened: (value: boolean) => void
  deleteDiscussion: (discussionId: string) => void
  deleteDiscussionDetails: () => void
}

export const DeleteTopicDiscussion = (props: DeleteTopicDiscussionProps) => {
  const [isPending, startDeleteTopicTransition] = useTransition();
  const router = useRouter()

  async function deleteTopic() {
    startDeleteTopicTransition(() => {
      toast.promise(
        deleteDiscussionById(props.discussionId, props.deleteDiscussion),
        {
          loading: "Deleting topic",
          success: "Topic deleted",
          error: "Failed deleting topic",
        },
      );
    });
    setTimeout(() => {
      props.setIsOpened(false);
      props.deleteDiscussionDetails()
      router.push("?topic=")
    }, 1000);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            discussion topic and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteTopic}>Confirm Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
