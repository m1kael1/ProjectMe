import { Comment } from "@/models";
import { create } from "zustand";

type CommentStore = {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  deleteComment: (commentId: string) => void;
};

export const commentStore = create<CommentStore>((set) => ({
  comments: [],
  setComments: (comments: Comment[]) =>
    set((state) => ({ ...state, comments: comments })),
  deleteComment: (commentId: string) =>
    set((state) => {
      const comments = state.comments.filter(
        (comment) => comment.id !== commentId
      );
      return { ...state, comments: comments };
    })
}));
