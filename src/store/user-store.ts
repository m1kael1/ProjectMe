import { User } from "@/models";
import { create } from "zustand";

type UserStore = {
  users: User[];
  setUsers: (users: User[]) => void;
};

export const userStore = create<UserStore>((set) => ({
  users: [],
  setUsers: (users) => set((state) => ({ ...state, users: users }))
}));
