import { client } from "@/db/client";

const record = client.collection("projects");

const findProjectDetails = async (projectId: string) => {
  const contributors = await record.getOne(projectId, {
    cache: "no-cache",
    expand: "contributors",
    fields:
      "id,name,description,tags,progress,createdBy,expand,created,updated",
    keepalive: true
  });

  return contributors;
};

export { findProjectDetails };
