'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'
import { Textarea } from '@/components/ui/textarea'
import { useProject } from '@/hooks/use-project'
import { useUsers } from '@/hooks/use-users'
import { Contributor, User, updateProjectSchema } from '@/models'
import { usePbAuth } from '@/providers/auth-provider'
import { updateProject } from '@/services/project.service'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { DeleteProject } from './delete-project'
import { useStore } from 'zustand'
import { projectStore } from '@/store/project-store'

type EditProjectFormProps = {
  projectId: string
}

export const EditProjectForm = (props: EditProjectFormProps) => {
  const { user: currentUser } = usePbAuth()
  const { users: usersList } = useUsers()
  const { projectDetails } = useProject({ projectId: props.projectId });
  const { updateProject: setUpdateProject } = useStore(projectStore)
  const [isPending, startAddProjectTransition] = useTransition();

  const selectUserList = usersList?.map((user: User) => {
    return { label: user.email, value: user.id }
  })

  const defaultContributors = projectDetails?.contributors?.map((contributor: Contributor) => contributor.id)

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      contributors: [],
      tags: "",
    }
  })

  useEffect(() => {
    form.setValue("name", projectDetails?.name as string)
    form.setValue("description", projectDetails?.description as string)
    form.setValue("tags", projectDetails?.tags as string)
    form.setValue("contributors", defaultContributors as string[])
  }, [projectDetails])

  async function onSubmit(values: z.infer<typeof updateProjectSchema>) {
    const projectData = {
      name: values.name,
      description: values.description,
      contributors: [currentUser?.id, ...values.contributors],
      createdBy: currentUser?.id,
      tags: values.tags,
    }
    const contributorRemove = defaultContributors?.filter((id: string) => !projectData.contributors.includes(id))
    const newContributors = projectData.contributors.filter((id?: string) => !defaultContributors?.includes(id as string))

    startAddProjectTransition(() => {
      toast.promise(updateProject(
        projectData,
        projectDetails?.id as string,
        setUpdateProject,
        contributorRemove as string[],
        newContributors as string[]),
        {
          loading: "Updating project",
          success: "Project updated",
          error: "Failed to update project",
        },
      );
    });
  }
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Edit Project</CardTitle>
      </CardHeader>
      <CardContent>
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
                      placeholder="tags of your project"
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
                  <FormControl>
                    {
                      !usersList ? (
                        <p className="text-sm text-red-500">No contributors found</p>
                      ) : <MultiSelect
                        options={selectUserList as any}
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
                    <Textarea className='max-h-[200px]' rows={4} id="description" placeholder="Description of your project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-2'>
              <Button className='w-fit' type="submit">Save changes</Button>
              <DeleteProject projectId={projectDetails?.id as string} />
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
