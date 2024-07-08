import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { NbVariant } from '@/components/ui/variant/nb-variant'
import { cn } from '@/lib/utils'
import { Contributor } from '@/models'
import Link from 'next/link'
import React from 'react'

type ProjectCardProps = {
  id: string
  name: string
  description: string
  progress: number
  tags: string
  created: Date
  updated: Date
  contributors: Contributor[]
}


const ProjectCard = (props: ProjectCardProps) => {
  const { contributors, description, id, name, progress, tags } = props
  const tagsList = tags?.split("#")

  return (
    <Link href={`/projects/${id}/dashboard`}  >
      <NbVariant className='rounded-xl h-full mr-1'>
        <Card className='h-full w-full flex flex-col justify-between'>
          <CardHeader>
            <div className='flex gap-2 flex-wrap '>
              {tagsList?.length == 1 && tagsList[0] == "" ?
                <Badge variant="secondary">No tags</Badge>
                : tagsList?.map((tag, index) => index != 0 && <Badge key={index} variant="secondary">{tag}</Badge>)}
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className='line-clamp-1'>{name}</CardTitle>
            <CardDescription className='line-clamp-2'>{description ? description : "No description"}</CardDescription>
            <Progress className='mt-4 h-3' color='bg-green-500' value={progress} />
          </CardContent>
          <CardFooter>
            <div className='flex px-3'>
              {contributors.slice(0, 5).map((contributor: Contributor, index: number) =>
                <Avatar key={index} className={cn('w-8 h-8 outline outline-2 outline-background rounded-full', index === index && '-ml-2 z-30')}>
                  <AvatarImage className='object-cover' src={contributor.avatarUrl} />
                </Avatar>
              )}
              {
                contributors?.length > 5 && <span className='-ml-1 rounded-full h-8 w-8 flex items-center justify-center bg-foreground/15 z-50 text-lg font-bold'>+{contributors?.length - 5}</span>
              }
            </div>
          </CardFooter>
        </Card>
      </NbVariant>
    </Link>



  )
}

export default ProjectCard