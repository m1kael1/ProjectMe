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
import { User, creatDiscussionSchema } from "@/models"
import { usePbAuth } from "@/providers/auth-provider"
import { DiscussionDetails, editDiscussion } from "@/services/discussion.service"
import { discussionStore } from "@/store/discussion-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { Delete, EllipsisIcon } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useStore } from "zustand"
import { DeleteTopicDiscussion } from "./delete-topic-discussion"
import { useRouter } from "next/navigation"

export function EditTopicDiscussion({ discussion }: { discussion: DiscussionDetails }) {
  const router = useRouter()
  const { user: currentUser } = usePbAuth()
  const { editDiscussions, deleteDiscussion, setDiscussionDetails, deleteDiscussionDetails } = useStore(discussionStore)

  const [isPending, startEditTopicTransition] = useTransition();
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [image, setImage] = useState<File>();

  const form = useForm<z.infer<typeof creatDiscussionSchema>>({
    resolver: zodResolver(creatDiscussionSchema),
  })

  useEffect(() => {
    form.setValue("title", discussion?.title)
    form.setValue("description", discussion?.description)
  }, [discussion])

  function onSubmit(values: z.infer<typeof creatDiscussionSchema>) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);

    if (image) {
      formData.append("image", image as Blob);
    }

    startEditTopicTransition(() => {
      toast.promise(
        editDiscussion(
          formData,
          discussion?.id as string,
          currentUser as User,
          editDiscussions,
          setDiscussionDetails,
        ),
        {
          loading: "Editing topic",
          success: "Topic edited",
          error: "Failed editing topic",
        },
      );
      form.reset();
    });
    setTimeout(() => {
      setIsOpened(false);
      router.push(`?topic=${discussion?.id}`)
    }, 1000);
  }

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger asChild>
        <EllipsisIcon className="hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[530px]">
        <DialogHeader>
          <DialogTitle>Edit topic</DialogTitle>
          <DialogDescription>
            Fill in your details to edit topic.
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
              <DeleteTopicDiscussion
                discussionId={discussion.id}
                setIsOpened={setIsOpened}
                deleteDiscussion={deleteDiscussion}
                deleteDiscussionDetails={deleteDiscussionDetails} />
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}
