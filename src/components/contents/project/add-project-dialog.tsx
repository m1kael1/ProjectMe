"use client"

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
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { NbVariant } from "@/components/ui/variant/nb-variant"
import { useUsers } from "@/hooks/use-users"
import { User, createProjectSchema } from "@/models"
import { usePbAuth } from "@/providers/auth-provider"
import { createProject } from "@/services/project.service"
import { projectStore } from "@/store/project-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useMemo, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useStore } from "zustand"

export function AddProjectDialog() {
  const { user: currentUser } = usePbAuth()
  const { users: usersList, isLoading } = useUsers()
  const { projects, setProjects } = useStore(projectStore);

  const [isPending, startAddProjectTransition] = useTransition();
  const [isOpened, setIsOpened] = useState(false);

  const contributorsList = usersList?.map((user: User) => {
    return { label: user.email, value: user.id }
  })

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      contributors: [],
      tags: "",
    }
  })

  async function onSubmit(values: z.infer<typeof createProjectSchema>) {
    const newProject = {
      name: values.name,
      description: values.description,
      contributors: [currentUser?.id, ...values.contributors],
      createdBy: currentUser?.id,
      progress: 0,
      tags: values.tags,
    }

    startAddProjectTransition(() => {
      toast.promise(createProject(newProject, projects, setProjects),
        {
          loading: "Creating project",
          success: "Project created",
          error: "Failed to create project",
        },
      );
      form.reset();
    });
    setTimeout(() => {
      setIsOpened(false);
    }, 1000);
  }

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <NbVariant className="rounded-md w-fit">
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Create new project
          </Button>
        </DialogTrigger>
      </NbVariant>
      <DialogContent className="sm:max-w-[530px]">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Fill in your details to create a new project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem >
                  <FormLabel>
                    Project Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name of your project"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="tags"
              control={form.control}
              render={({ field }) => (
                <FormItem >
                  <FormLabel>
                    Tags
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="#tag1#tag2#tag3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="contributors"
              control={form.control}
              render={({ field }) => (
                <FormItem >
                  <FormLabel>
                    Contributors
                  </FormLabel>
                  <FormControl>{
                    isLoading ? <Skeleton className="w-full h-8" /> :
                      <MultiSelect
                        options={contributorsList as any}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Select contributors"
                        variant="inverted"
                        animation={2}
                        maxCount={3}
                      // {...field}
                      />
                  }

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem >
                  <FormLabel>
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea id="description" placeholder="Description of your project" {...field} />
                  </FormControl>
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