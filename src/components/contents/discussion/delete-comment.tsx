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
import { deleteCommentById } from "@/services/comment.service"
import { Trash2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

type DeleteTopicDiscussionProps = {
  commentId: string
  deleteComment: (discussionId: string) => void
}

export const DeleteComment = (props: DeleteTopicDiscussionProps) => {
  const [isPending, startDeleteTopicTransition] = useTransition();

  async function deleteComment() {
    startDeleteTopicTransition(() => {
      toast.promise(
        deleteCommentById(props.commentId, props.deleteComment),
        {
          loading: "Deleting comment",
          success: "Comment deleted",
          error: "Failed deleting comment",
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
            This action cannot be undone. This will permanently delete this comment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteComment}
          >
            Confirm Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
