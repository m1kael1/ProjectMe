"use client"

import React from 'react'
import { TopicCard } from './topic-card'
import { AddTopicDialog } from './add-topic-dialog'
import { User } from '@/models'
import useDiscussion from '@/hooks/use-discussion'
import { DiscussionDetails } from '@/services/discussion.service'

type DiscussionTopicProps = {
  projectId: string
}

export const DiscussionTopic = (props: DiscussionTopicProps) => {
  const { discussions } = useDiscussion({ projectId: props.projectId })

  return (
    <section>
      <AddTopicDialog />
      <div className='flex lg:flex-col mt-4 gap-3 overflow-auto lg:h-full lg:pb-20 z-0'>
        {discussions.map((discussion: DiscussionDetails, index: number) => <TopicCard key={index} discussion={discussion} />)}
      </div>
    </section>
  )
}
