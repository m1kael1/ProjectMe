'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { NbVariant } from '@/components/ui/variant/nb-variant'
import { client } from '@/db/client'
import { User, createCommentSchema } from '@/models'
import { usePbAuth } from '@/providers/auth-provider'
import { commentStore } from '@/store/comment-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useStore } from 'zustand'

type NewComment = {
  text: string
  discussion: string
  createdBy: string
}

export const AddCommentDiscussion = ({ discussionId }: { discussionId: string }) => {
  const { user: currentUser } = usePbAuth()
  const { comments, setComments } = useStore(commentStore)

  const [isPending, startSendCommentTransition] = useTransition();

  const form = useForm<z.infer<typeof createCommentSchema>>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      text: "",
    }
  })

  const createComment = (newComment: NewComment) => {
    return () => new Promise((resolve) => {
      client.collection("comments").create(newComment).then((result) => {
        client.collection("discussions").update(discussionId, {
          "comments+": [result.id]
        })
        setComments([{
          id: result.id,
          text: result.text,
          createdBy: currentUser as User,
          created: new Date(result.created)
        }, ...comments])
        resolve(result);
      })
    })
  }

  function onsubmit(values: z.infer<typeof createCommentSchema>) {
    const newComment: NewComment = {
      text: values.text,
      createdBy: currentUser?.id as string,
      discussion: discussionId,
    }

    startSendCommentTransition(() => {
      toast.promise(createComment(newComment),
        {
          loading: "Sending comment",
          success: "Comment sent",
          error: "Failed sending comment",
        },
      );
      form.reset();
    });
  }

  return (
    <Form {...form}>
      <h3 className="text-lg font-bold">Add Comments</h3>
      <form className='flex flex-col gap-4 mt-4' onSubmit={form.handleSubmit(onsubmit)}>
        <div className='flex gap-4 w-full'>
          <Avatar>
            <AvatarImage className='object-cover' src={currentUser?.avatarUrl} />
            <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className='w-full' >
                <FormControl>
                  <NbVariant className='rounded-md'>
                    <Textarea
                      className='w-full max-h-96'
                      {...field}
                    />
                  </NbVariant>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>


        <Button className='w-fit self-end' type='submit'>Send Comment</Button>
      </form>
    </Form>
  )
}
