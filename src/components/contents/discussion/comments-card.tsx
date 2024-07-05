'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Comment } from '@/models'
import { formatDistanceToNowStrict } from 'date-fns'
import { EllipsisIcon } from 'lucide-react'
import { DeleteComment } from './delete-comment'
import { usePbAuth } from '@/providers/auth-provider'
import { NbVariant } from '@/components/ui/variant/nb-variant'

type CommentsCardProps = {
  discussionOwnerId: string
  comment: Comment
  deleteComment: (commentId: string) => void
}

export const CommentsCard = (props: CommentsCardProps) => {
  const avatarUrl = props.comment.createdBy.avatarUrl
  const { user: currentUser } = usePbAuth()

  return (
    <NbVariant className='rounded-xl'>
      <Card >
        <CardHeader >
          <div className='flex gap-1 items-center'>
            <Avatar>
              {
                avatarUrl ?
                  <AvatarImage className='object-cover' src={avatarUrl} />
                  : <AvatarFallback>CN</AvatarFallback>
              }
            </Avatar>
            <div>
              <CardTitle className='ml-2 w-fit'>{props?.comment?.createdBy?.name}
              </CardTitle>
              <CardDescription className='ml-2 h-fit text-sm text-muted-foreground font-light'>
                {formatDistanceToNowStrict(props?.comment?.created, { addSuffix: true })}
              </CardDescription>
            </div>

            {
              props?.comment?.createdBy?.id === currentUser?.id ||
                props?.discussionOwnerId === currentUser?.id ?
                <div className='ml-auto'>
                  <Popover >
                    <PopoverTrigger>
                      <EllipsisIcon className='ml-auto' />
                    </PopoverTrigger>
                    <PopoverContent className='w-fit'>
                      <DeleteComment commentId={props?.comment?.id} deleteComment={props?.deleteComment} />
                    </PopoverContent>
                  </Popover>
                </div> : null
            }
          </div>
        </CardHeader>
        <CardContent>
          <p>{props?.comment?.text}</p>
        </CardContent>
      </Card>
    </NbVariant>
  )
}
