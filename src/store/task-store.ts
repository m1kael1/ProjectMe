import { Task } from "@/models";
import { create } from "zustand";

type TaskStore = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  deleteTask: (taskId: string) => void;
};

export const taskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set((state) => ({ ...state, tasks: tasks })),
  deleteTask: (taskId) =>
    set((state) => ({
      ...state,
      tasks: state.tasks.filter((task) => task.id !== taskId)
    }))
}));
