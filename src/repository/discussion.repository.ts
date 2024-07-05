import { client } from "@/db/client";

const record = client.collection("discussions");

const findDiscussionById = async (discussionId: string) => {
  const discussion = await record.getOne(discussionId, {
    cache: "no-cache",
    keepalive: true,
    expand: "createdBy, comments.createdBy",
    fields: "id,title,created,updated,description,image,expand"
  });

  return discussion;
};

const findDiscussionByProjectId = async (projectId: string) => {
  const discussions = await record.getFullList({
    cache: "no-cache",
    keepalive: true,
    expand: "createdBy, comments.createdBy",
    fields: "id,title,created,updated,description,image,expand",
    filter: `project = "${projectId}"`
  });

  return discussions;
};

export { findDiscussionById, findDiscussionByProjectId };
