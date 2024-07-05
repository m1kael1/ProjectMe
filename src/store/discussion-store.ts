import { Comment } from "@/models";
import { DiscussionDetails } from "@/services/discussion.service";
import { create } from "zustand";

type DiscussionStore = {
  discussionDetails?: DiscussionDetails;
  discussions: DiscussionDetails[];
  setDiscussionDetails: (discussion: DiscussionDetails) => void;
  setDiscussions: (discussions: DiscussionDetails[]) => void;
  editDiscussions: (discussion: DiscussionDetails) => void;
  deleteDiscussion: (discussionId: string) => void;
  deleteDiscussionDetails: () => void;
};

export const discussionStore = create<DiscussionStore>((set) => ({
  discussionDetails: undefined,
  discussions: [],
  setDiscussionDetails: (discussion) => set({ discussionDetails: discussion }),
  setDiscussions: (discussions) =>
    set((state) => ({ ...state, discussions: discussions })),
  editDiscussions: (discussion) =>
    set((state) => {
      const index = state.discussions.findIndex((d) => d.id === discussion.id);
      state.discussions[index] = discussion;
      return { ...state };
    }),
  deleteDiscussion: (discussionId) =>
    set((state) => {
      const index = state.discussions.findIndex((d) => d.id === discussionId);
      state.discussions.splice(index, 1);
      return { ...state };
    }),
  deleteDiscussionDetails: () => set({ discussionDetails: undefined })
}));
