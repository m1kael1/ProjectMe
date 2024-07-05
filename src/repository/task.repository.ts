import { client } from "@/db/client";

const record = client.collection("tasks");

async function findTasksByProjectId(projectId: string) {
  const tasks = await record.getFullList({
    sort: "-created",
    cache: "no-cache",
    expand: "for,project",
    fields: "id,content,expand,columnId",
    filter: `project = "${projectId}"`,
    keepalive: true
  });

  return tasks;
}

export { findTasksByProjectId };
