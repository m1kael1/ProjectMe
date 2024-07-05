"use client";

import {
  getDiscussionById,
  getDiscussionByProjectId
} from "@/services/discussion.service";
import { commentStore } from "@/store/comment-store";
import { discussionStore } from "@/store/discussion-store";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

const useDiscussion = ({
  discussionId,
  projectId
}: {
  discussionId?: string;
  projectId?: string;
}) => {
  // const [discussion, setDiscussion] = useState<DiscussionDetails>();
  const {
    discussionDetails,
    discussions,
    setDiscussions,
    setDiscussionDetails
  } = useStore(discussionStore);
  const { comments, setComments, deleteComment } = useStore(commentStore);
  // const router = useRouter();

  const getDiscussionDetails = async (discussionId: string) => {
    try {
      const { discussionDetails, comments } = await getDiscussionById(
        discussionId
      );
      setDiscussionDetails(discussionDetails);
      setComments(comments);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const getListDiscussionProject = async (projectId: string) => {
    try {
      const discussions = await getDiscussionByProjectId(projectId);
      setDiscussions(discussions);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (discussionId) {
      getDiscussionDetails(discussionId);
    }
    if (projectId) {
      getListDiscussionProject(projectId);
    }
  }, [discussionId, projectId]);

  return { discussionDetails, comments, discussions, deleteComment };
};

export default useDiscussion;
