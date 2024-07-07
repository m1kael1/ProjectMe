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
  const {
    discussionDetails,
    discussions,
    setDiscussions,
    setDiscussionDetails
  } = useStore(discussionStore);
  const { comments, setComments, deleteComment } = useStore(commentStore);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDiscussionDetails = async (discussionId: string) => {
    setIsLoading(true);
    try {
      const { discussionDetails, comments } = await getDiscussionById(
        discussionId
      );
      setDiscussionDetails(discussionDetails);
      setComments(comments);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getListDiscussionProject = async (projectId: string) => {
    setIsLoading(true);
    try {
      const discussions = await getDiscussionByProjectId(projectId);
      if (!discussions) throw new Error("Discussion record not found");
      setDiscussions(discussions);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
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

  return { discussionDetails, comments, discussions, deleteComment, isLoading };
};

export default useDiscussion;
