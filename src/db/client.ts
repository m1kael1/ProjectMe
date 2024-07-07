import PocketBase from "pocketbase";

export const client = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL
  // "https://project-me.pockethost.io"
);

client.autoCancellation(false);
