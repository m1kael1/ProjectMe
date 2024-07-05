'use client'

import { usePbAuth } from '@/providers/auth-provider'
import ProjectCard from './project-card'
import { useProject } from '@/hooks/use-project'
import { Fragment } from 'react'


export const ProjectList = () => {
  const { user: currentUser } = usePbAuth()
  const { projects } = useProject({ currentUserId: currentUser?.id as string })

  return (
    <Fragment>
      {projects?.length === 0 ? <div>No projects found</div> :
        projects?.map((project: any) => {
          return <ProjectCard key={project.id} {...project} />
        })
      }
    </Fragment>
  )
}
