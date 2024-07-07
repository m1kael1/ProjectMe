'use client'

import PlaceholderContent from '@/components/contents/placeholder-content'
import Planner from '@/components/contents/planner/planner'
import { ContentLayout } from '@/components/dashboard-panel/content-layout'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { usePlanner } from '@/hooks/use-planner'
import { useProject } from '@/hooks/use-project'
import { Resource } from '@/models'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function PlannersPage() {
  const { id } = useParams()
  const { projectDetails } = useProject({
    projectId: id as string
  })
  const { listPlanners } = usePlanner({
    projectId: id as string
  })


  return (
    <ContentLayout title="Planners">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/projects/${id}/dashboard`}>Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Planners</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PlaceholderContent>
        <div className="flex w-full flex-col h-full">{
          projectDetails?.contributors &&
          projectDetails?.contributors?.length > 0 &&
          listPlanners &&
          <Planner
            initialResources={projectDetails?.contributors as Resource[]}
            initialPlanners={listPlanners}
          />
        }
        </div>
      </PlaceholderContent>
    </ContentLayout>
  )
}

const Planners = [{
  id: '1',
  title: "Planner 1",
  start: new Date(),
  end: new Date(),
  resourceId: "npkzk1htdml0fuc",
}, {
  id: '2',
  title: "Planner 2",
  start: new Date(),
  end: new Date(),
  resourceId: "sbls8brcdgzndos",
}]

