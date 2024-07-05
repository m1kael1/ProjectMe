import { ColumnId } from "@/components/contents/todo/kanban-board";
import { client } from "@/db/client";
import { Task, User } from "@/models";
import { findTasksByProjectId } from "@/repository/task.repository";
import { UniqueIdentifier } from "@dnd-kit/core";
import { RecordModel } from "pocketbase";

const getAlltasksByProjectId = async (projectId: string) => {
  const tasksList = await findTasksByProjectId(projectId);

  const tasks = tasksList.map((task: RecordModel) => {
    return {
      id: task.id as UniqueIdentifier,
      columnId: task?.columnId as ColumnId,
      content: task?.content as string,
      for: task?.expand?.for as User
    };
  });

  if (tasks.length === 0) {
    return [];
  }

  return tasks;
};

const deleteTaskById = (
  taskId: string,
  deleteTask: (taskId: string) => void
) => {
  return () =>
    new Promise((resolve) => {
      client
        .collection("tasks")
        .delete(taskId)
        .then((result) => {
          deleteTask(taskId);
          resolve(result);
        });
    });
};

export { getAlltasksByProjectId, deleteTaskById };
