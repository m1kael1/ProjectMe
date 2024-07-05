'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Fragment } from 'react'
import { CommentsCard } from './comments-card'
import { Comment } from '@/models'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNowStrict } from 'date-fns'
import { AddCommentDiscussion } from './add-comment-discussion'
import useDiscussion from '@/hooks/use-discussion'
import { EditTopicDiscussion } from './edit-topic-discussion'
import { usePbAuth } from '@/providers/auth-provider'

type DiscussionContentProps = {
  topic: string
}

export const DiscussionContent = (props: DiscussionContentProps) => {
  const { user: currentUser } = usePbAuth()
  const { discussionDetails: discussion, comments, deleteComment } = useDiscussion({ discussionId: props.topic })

  return (
    <Fragment>
      {discussion ? (
        <Card className='w-full h-full overflow-auto'>
          <CardHeader>
            <div className='flex gap-1 items-center mb-4'>
              <div className='flex w-full items-center'>
                <Avatar>
                  <AvatarImage className='object-cover' src={discussion.createdBy.avatarUrl} />
                </Avatar>
                <div >
                  <CardTitle className='ml-2'>{discussion?.createdBy?.name}
                  </CardTitle>
                  <CardDescription className='ml-2 h-fit text-sm text-muted-foreground font-light'>{formatDistanceToNowStrict(discussion?.created, { addSuffix: true })}</CardDescription>
                </div>
              </div>
              {currentUser?.id === discussion?.createdBy?.id && <EditTopicDiscussion discussion={discussion} />}
            </div>
            <h3 className="text-lg font-bold">{discussion?.title}</h3>
          </CardHeader>
          <CardContent>
            {discussion?.image &&
              (<Fragment>
                <img src={discussion?.image} alt="logo" width={500} height={500} />
                <Separator className='my-4' />
              </Fragment>)}
            <p>{discussion?.description}</p>
            <Separator className='my-4' />
            <AddCommentDiscussion discussionId={discussion?.id} />
          </CardContent>
          <Separator className='my-4' />
          <CardFooter className='flex-col items-start'>
            <h3 className="text-lg font-bold">{comments?.length ? comments.length : 0} comment</h3>
            <section className='flex flex-col gap-4 w-full mt-2'>
              {comments?.map((comment: Comment) =>
              (<CommentsCard
                key={comment.id}
                comment={comment}
                discussionOwnerId={discussion?.createdBy?.id}
                deleteComment={deleteComment} />))}
            </section>
          </CardFooter>
        </Card>
      ) : (
        <Card className='w-full h-full flex flex-col items-center justify-center'>
          <CardHeader>
            <CardTitle>No Discussions Display</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-center'>
              There are currently no discussions display for this topic. Please create a new discussion or select another topic
            </p>
          </CardContent>
        </Card>
      )}
    </Fragment>
  )
}
