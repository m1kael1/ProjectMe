import { Task } from "@/models";
import { getAlltasksByProjectId } from "@/services/task.service";
import { taskStore } from "@/store/task-store";
import { useEffect } from "react";
import { useStore } from "zustand";

export const useTask = (projectId: string) => {
  const { tasks, setTasks } = useStore(taskStore);

  async function getTasksByProjectId(projectId: string) {
    try {
      const tasks = await getAlltasksByProjectId(projectId);
      setTasks(tasks);
    } catch (error: any) {
      console.error("Error fetching tasks:", error.message);
    }
  }

  useEffect(() => {
    if (projectId) {
      getTasksByProjectId(projectId);
    }
  }, [projectId]);

  return { tasks, setTasks };
};
