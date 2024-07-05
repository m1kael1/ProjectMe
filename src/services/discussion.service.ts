import { client } from "@/db/client";
import { getImageUrl, sortByCreated } from "@/lib/utils";
import { Comment, User } from "@/models";
import {
  findDiscussionById,
  findDiscussionByProjectId
} from "@/repository/discussion.repository";

export type DiscussionDetails = {
  id: string;
  title: string;
  description: string;
  created: Date;
  updated: Date;
  createdBy: User;
  image?: string;
};

const getDiscussionById = async (discussionId: string) => {
  const discussion = await findDiscussionById(discussionId);

  if (!discussion) throw new Error("Discussion record not found");

  const image = await getImageUrl(
    "discussions",
    discussion?.id as string,
    discussion?.image as string
  );

  const createdBy = discussion.expand?.createdBy;
  let comments: Comment[] = discussion?.expand?.comments
    ?.sort(sortByCreated)
    .map(
      ({
        id,
        text,
        created,
        expand: { createdBy }
      }: {
        id: string;
        text: string;
        created: string;
        expand: { createdBy: User };
      }) => {
        return {
          id,
          text,
          created: new Date(created),
          createdBy
        };
      }
    );

  if (!comments) {
    comments = [];
  }

  const discussionDetails: DiscussionDetails = {
    id: discussion.id as string,
    title: discussion.title as string,
    description: discussion.description as string,
    created: new Date(discussion.created),
    updated: new Date(discussion.updated),
    createdBy,
    image
  };

  return { discussionDetails, comments };
};

const getDiscussionByProjectId = async (projectId: string) => {
  const discussions = await findDiscussionByProjectId(projectId);
  if (!discussions) throw new Error("Discussion record not found");

  const listDiscussions: DiscussionDetails[] = discussions
    .sort(sortByCreated)
    .map((discussion) => {
      return {
        id: discussion.id,
        title: discussion.title,
        description: discussion.description,
        created: new Date(discussion.created),
        updated: new Date(discussion.updated),
        createdBy: discussion.expand?.createdBy
      };
    });

  return listDiscussions;
};

const createDiscussion = (
  newTopic: any,
  projectId: string,
  currentUser: User,
  discussions: DiscussionDetails[],
  setDiscussions: (discussions: DiscussionDetails[]) => void
) => {
  return () =>
    new Promise((resolve) => {
      client
        .collection("discussions")
        .create(newTopic)
        .then((result) => {
          client.collection("projects").update(projectId, {
            "discussions+": [result.id]
          });
          setDiscussions([
            {
              id: result.id,
              title: result.title,
              description: result.description,
              image: result.image,
              createdBy: currentUser as User,
              created: new Date(result.created),
              updated: new Date(result.updated)
            },
            ...discussions
          ]);
          resolve(result);
        });
    });
};

const editDiscussion = (
  formData: FormData,
  discussionId: string,
  currentUser: User,
  setDiscussionDetails: (discussion: DiscussionDetails) => void,
  setDiscussions: (discussions: DiscussionDetails) => void
) => {
  const image = formData.get("image");

  const data = image
    ? {
        title: formData.get("title"),
        description: formData.get("description"),
        image
      }
    : {
        title: formData.get("title"),
        description: formData.get("description")
      };

  return () =>
    new Promise((resolve) => {
      client
        .collection("discussions")
        .update(discussionId, data)
        .then(async (result) => {
          const image = await getImageUrl(
            "discussions",
            discussionId,
            result.image
          );
          setDiscussions({
            id: result.id,
            title: result.title,
            description: result.description,
            image: image,
            createdBy: currentUser as User,
            created: new Date(result.created),
            updated: new Date(result.updated)
          });
          setDiscussionDetails({
            id: result.id,
            title: result.title,
            description: result.description,
            image: image,
            createdBy: currentUser as User,
            created: new Date(result.created),
            updated: new Date(result.updated)
          });
          resolve(result);
        });
    });
};

const deleteDiscussionById = (
  discussionId: string,
  deleteDiscussions: (discussionId: string) => void
) => {
  return () =>
    new Promise((resolve) => {
      client
        .collection("discussions")
        .delete(discussionId)
        .then((result) => {
          deleteDiscussions(discussionId);
          resolve(result);
        });
    });
};

export {
  getDiscussionById,
  getDiscussionByProjectId,
  createDiscussion,
  editDiscussion,
  deleteDiscussionById
};
