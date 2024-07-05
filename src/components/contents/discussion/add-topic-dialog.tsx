'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { NbVariant } from "@/components/ui/variant/nb-variant"
import { client } from "@/db/client"
import { User, creatDiscussionSchema } from "@/models"
import { usePbAuth } from "@/providers/auth-provider"
import { createDiscussion } from "@/services/discussion.service"
import { discussionStore } from "@/store/discussion-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useStore } from "zustand"

export function AddTopicDialog() {
  const { user: currentUser } = usePbAuth()
  const projectId = useParams().id as string
  const { discussions, setDiscussions } = useStore(discussionStore)


  const [isPending, startAddTopicTransition] = useTransition();
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [image, setImage] = useState<File>();


  const form = useForm<z.infer<typeof creatDiscussionSchema>>({
    resolver: zodResolver(creatDiscussionSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
    }
  })

  function onSubmit(values: z.infer<typeof creatDiscussionSchema>) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("createdBy", currentUser?.id as string);
    formData.append("project", projectId);

    if (image) {
      formData.append("image", image);
    }

    startAddTopicTransition(() => {
      toast.promise(createDiscussion(formData, projectId, currentUser as User, discussions, setDiscussions),
        {
          loading: "Creating topic",
          success: "Topic created",
          error: "Failed creating topic",
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
      <NbVariant className='rounded-md mr-1'>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full ">
            <Plus className="w-4 h-4 mr-2" /> Create new topic
          </Button>
        </DialogTrigger>
      </NbVariant>
      <DialogContent className="sm:max-w-[530px]">
        <DialogHeader>
          <DialogTitle>Create new topic</DialogTitle>
          <DialogDescription>
            Fill in your details to create a new topic.
          </DialogDescription>
        </DialogHeader>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>

              )}
            />
            <FormField
              name="image"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl {...field}>
                    <Input
                      // hidden
                      type="file"
                      placeholder="Image"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setImage(file)
                        form.setValue("image", file?.name)
                      }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}
