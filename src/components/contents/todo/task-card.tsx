import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { EllipsisIcon, GripVertical } from "lucide-react";
import { ColumnId } from "./kanban-board";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Contributor } from "@/models";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DeleteTask } from "./delete-task";
import { useStore } from "zustand";
import { taskStore } from "@/store/task-store";
import { NbVariant } from "@/components/ui/variant/nb-variant";

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: string;
  for: Contributor;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  isCompleted?: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;

}

export function TaskCard({ task, isOverlay, isCompleted }: TaskCardProps) {
  const { deleteTask } = useStore(taskStore)

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      }
    },
  });

  return (
    <NbVariant className="rounded-xl">
      <Card
        ref={setNodeRef}
        style={style}
        className={variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        })}
      >
        <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">{
          isCompleted ? <div className="bg-green-500 text-white text-xs px-2 py-1 h-fit rounded"> Completed</div> : <Button
            variant={"ghost"}
            {...attributes}
            {...listeners}
            className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
          >
            <span className="sr-only">Move task</span>
            <GripVertical />
          </Button>

        }

          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Avatar className="ml-auto w-8 h-8">
                  <AvatarImage className="object-cover" src={task?.for.avatarUrl} />
                  <AvatarFallback delayMs={600}>
                    {task?.for.name}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="top">
                {task?.for.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <div className="flex w-full justify-end">
          <Popover >
            <PopoverTrigger>
              <EllipsisIcon className="mr-4 " />
            </PopoverTrigger>
            <PopoverContent className='w-fit'>
              <DeleteTask deleteTask={deleteTask} taskId={task?.id as string} />
            </PopoverContent>
          </Popover>
        </div>
        <CardContent className="px-3 pt-0 pb-6 text-left whitespace-pre-wrap">
          {task.content}
        </CardContent>
      </Card>
    </NbVariant>
  );
}