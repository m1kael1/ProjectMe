"use client"

import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { User } from '@/models'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatDistanceToNowStrict } from 'date-fns'
import { NbVariant } from '@/components/ui/variant/nb-variant'

type TopicCardProps = {
  discussion: {
    id: string;
    title: string;
    description: string;
    created: Date;
    updated: Date
    createdBy: User
  }
}

export const TopicCard = (props: TopicCardProps) => {
  const { created, createdBy, description, id, title } = props.discussion

  const router = useRouter()
  const selectedTopicId = useSearchParams().get('topic')

  function selectTopic() {
    router.push(`?topic=${id}`)
  }

  return (
    <NbVariant className='rounded-xl mr-1'>
      <Card onClick={selectTopic} className={cn(
        'min-w-72 max-w-72',
        'cursor-pointer',
        selectedTopicId === id && 'bg-foreground/10')}>
        <CardHeader >
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-foreground/60">{createdBy.name}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm line-clamp-2">{description}</p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-foreground/60">Created {formatDistanceToNowStrict(created, { addSuffix: true })}</p>
        </CardFooter>
      </Card>
    </NbVariant>
  )
}
