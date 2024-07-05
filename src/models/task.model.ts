import { ColumnId } from "@/components/contents/todo/kanban-board";
import { UniqueIdentifier } from "@dnd-kit/core";
import { z } from "zod";
import { Contributor } from "./project.model";

export type Task = {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: string;
  for: Contributor;
};

export const createTaskSchema = z.object({
  task: z.string().min(1, "Task is required"),
  for: z.string().min(1, "For is required")
});
