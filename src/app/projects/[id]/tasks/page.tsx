"use client";

import { KanbanBoard } from '@/components/contents/todo/kanban-board'
import Link from "next/link";
import PlaceholderContent from "@/components/contents/placeholder-content";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React from 'react'
import { useParams } from 'next/navigation';
import { useTask } from '@/hooks/use-task';
import { AddTaskDialog } from '@/components/contents/todo/add-task-dialog';

export default function TasksPage() {
  const params = useParams()
  const { tasks } = useTask(params?.id as string)

  return (
    <ContentLayout title="Tasks">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbLink asChild>
            <Link href={`/projects/${params?.id}/dashboard`}>Dashboard</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tasks</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PlaceholderContent className='flex flex-col'>
        <AddTaskDialog projectId={params?.id as string} />
        <KanbanBoard tasksProject={tasks} />
      </PlaceholderContent>
    </ContentLayout>
  )
}
