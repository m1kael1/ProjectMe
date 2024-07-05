"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { NbVariant } from "@/components/ui/variant/nb-variant"
import { client } from "@/db/client"
import { useProject } from "@/hooks/use-project"
import { Contributor, User, createProjectSchema, createTaskSchema } from "@/models"
import { taskStore } from "@/store/task-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { RecordModel } from "pocketbase"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useStore } from "zustand"

type AddTaskDialogProps = {
  projectId: string,
}

export function AddTaskDialog(props: AddTaskDialogProps) {
  const { projectContributors } = useProject({ projectId: props.projectId })
  const { tasks, setTasks } = useStore(taskStore)
  const [isPending, startAddTaskTransition] = useTransition();
  const [isOpened, setIsOpened] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      task: "",
      for: "",
    }
  })

  const createTask = (newTask: any) => {
    return () => new Promise((resolve) => {
      client.collection("tasks").create(newTask).then((result) => {
        client.collection("projects").update(props.projectId, {
          "tasks+": [result.id]
        });
        client.collection("users").getOne(result.for, {
          fields: 'id,name,avatarUrl'
        }).then((user: RecordModel) => {
          setTasks([{
            id: result.id,
            content: result.content,
            columnId: result.columnId,
            for: {
              id: user.id,
              name: user.name,
              avatarUrl: user.avatarUrl
            },
          }, ...tasks]);
        })

        resolve(result);
      })
    })
  }

  async function onSubmit(values: z.infer<typeof createTaskSchema>) {
    const newTask = {
      content: values.task,
      columnId: "todo",
      for: values.for,
      project: props.projectId
    }

    startAddTaskTransition(() => {
      toast.promise(createTask(newTask),
        {
          loading: "Creating task",
          success: "Task created",
          error: "Failed to create task",
        },
      );
      form.reset();
    });
    setTimeout(() => {
      setIsOpened(false);
    }, 1000);
    router.refresh();
  }

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <NbVariant className='rounded-md w-fit'>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-fit">
            <Plus className="w-4 h-4 mr-2" /> Create new task
          </Button>
        </DialogTrigger>
      </NbVariant>
      <DialogContent className="sm:max-w-[530px]">
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
          <DialogDescription>
            Fill in your details to create a new task.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4">
            <FormField
              name="task"
              control={form.control}
              render={({ field }) => (
                <FormItem >
                  <FormLabel>
                    Task
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Task"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="for"
              control={form.control}
              render={({ field }) => (
                <FormItem >
                  <FormLabel>
                    For
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contributor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        projectContributors.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex flex-row items-center">
                              <Avatar className="w-6 h-6" >
                                <AvatarImage className="object-cover" src={user.avatarUrl} />
                                <AvatarFallback>
                                  {user.name}
                                </AvatarFallback>
                              </Avatar>
                              <p className="ml-2">{user.name}</p>
                            </div>
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

