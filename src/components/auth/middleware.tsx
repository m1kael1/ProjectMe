"use client"

import { useProject } from '@/hooks/use-project'
import { useParams, useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect } from 'react'

export const AuthMiddleware = ({ children }: PropsWithChildren) => {
  const currentUser = JSON.parse(localStorage.getItem("pocketbase_auth") as string)
  const router = useRouter()

  useEffect(() => {
    if (!currentUser.model) {
      router.push("/signin")
    }
  })

  return (
    children
  )
}

export const ProjectMiddleware = ({ children }: PropsWithChildren) => {
  const currentUser = JSON.parse(localStorage.getItem("pocketbase_auth") as string)
  const { id } = useParams()
  const { projectContributors } = useProject({ projectId: id as string })
  const router = useRouter()

  if (projectContributors.length > 0 && currentUser) {
    const isContributor = projectContributors.filter((contributor) => contributor.id === currentUser.model.id)[0]

    if (!isContributor) {
      router.push("/404")
    }
  }
  return (
    children
  )
}
