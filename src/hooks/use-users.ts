import { client } from "@/db/client";
import { User } from "@/models";
import { userStore } from "@/store/user-store";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

export const useUsers = () => {
  // const [users, setUsers] = useState<User[]>([]);
  const { users, setUsers } = useStore(userStore);

  async function getAllUsers() {
    const users = await client.collection("users").getFullList({
      sort: "-created",
      cache: "no-cache",
      fields: "id,email,avatar,name",
      keepalive: true,
      expand: "projects"
    });

    // @ts-ignore
    setUsers(users);
  }

  useEffect(() => {
    if (users.length === 0) {
      getAllUsers();
    }
  }, []);

  return { users };
};
