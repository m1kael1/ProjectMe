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
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type DiscussionContentProps = {
  topic: string
}

export const DiscussionContent = (props: DiscussionContentProps) => {
  const { user: currentUser } = usePbAuth()
  const { discussionDetails: discussion, comments, deleteComment, isLoading } = useDiscussion({ discussionId: props.topic })

  return (
    <Fragment>
      {isLoading ? (
        <DiscussionContentSkeleton />
      ) :
        discussion ? (
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

const DiscussionContentSkeleton = () => {
  return <Card className='w-full h-full overflow-auto'>
    <CardHeader>
      <div className='flex gap-1 items-center mb-4'>
        <div className='flex w-full items-center'>
          <Skeleton className='w-14 h-14 rounded-full' />
          <div >
            <Skeleton className='ml-2 w-full max-w-64 h-4' />
            <Skeleton className='ml-2 w-40 h-2 mt-2' />
          </div>
        </div>
      </div>
      <Skeleton className='ml-2 w-56 h-4' />
    </CardHeader>
    <CardContent>{
      Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className={cn('ml-2 w-full h-4', i > 0 && 'mt-4')} />
      ))}
      <Skeleton className='ml-2 w-full max-w-56 h-4 mt-8 mb-4' />
      <div className='mt-4 flex gap-4 items-center'>
        <Skeleton className='w-14 h-14 rounded-full' />
        <Skeleton className='ml-2 w-full h-11 my-4' />
      </div>
      <div className='w-full flex justify-end'>
        <Skeleton className='ml-2 w-full max-w-32 h-8' />
      </div>
    </CardContent>

    <CardFooter className='flex flex-col items-start' >
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className={cn(
          'ml-2 w-full max-w-56 h-4 mt-8 mb-4',
          i > 0 && 'mt-4 h-11 max-w-full')} />
      ))}
    </CardFooter>
  </Card>
}
