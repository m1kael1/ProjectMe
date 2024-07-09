import { client } from "@/db/client";
import { userStore } from "@/store/user-store";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

export const useUsers = () => {
  // const [users, setUsers] = useState<User[]>([]);
  const { users, setUsers } = useStore(userStore);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function getAllUsers() {
    setIsLoading(true);

    try {
      const users = await client.collection("users").getFullList({
        sort: "-created",
        cache: "no-cache",
        fields: "id,email,avatar,name",
        keepalive: true,
        expand: "projects"
      });

      // @ts-ignore
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (users.length === 0) {
      getAllUsers();
    }
  }, []);

  return { users, isLoading };
};
