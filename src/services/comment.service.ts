import { client } from "@/db/client";

const deleteCommentById = (
  commentId: string,
  deleteComment: (commentId: string) => void
) => {
  return () =>
    new Promise((resolve) => {
      client
        .collection("comments")
        .delete(commentId)
        .then((result) => {
          deleteComment(commentId);
          resolve(result);
        });
    });
};

export { deleteCommentById };
