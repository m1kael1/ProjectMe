import { client } from "@/db/client";
import { RecordModel } from "pocketbase";

const record = client.collection("users");

const findUserById = async (userId: string) => {
  const user: RecordModel = await record.getOne(userId, {
    cache: "no-cache",
    expand: "projects.contributors",
    fields: "id,name,expand",
    keepalive: true
  });
  return user;
};

export { findUserById };
