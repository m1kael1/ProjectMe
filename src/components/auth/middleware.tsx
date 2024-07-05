"use client"

import { useProject } from '@/hooks/use-project'
import { useParams, useRouter } from 'next/navigation'
import { PropsWithChildren, } from 'react'

export const AuthMiddleware = ({ children }: PropsWithChildren) => {
  const router = useRouter()

  try {
    const currentUser = JSON.parse(localStorage.getItem("pocketbase_auth") as string)
    if (!currentUser.model) {
      throw new Error("You are not logged in")
    }
  } catch (e) {
    router.push("/signin")
  }
  return (
    children
  )
}

export const ProjectMiddleware = ({ children }: PropsWithChildren) => {
  const router = useRouter()
  const { id } = useParams()
  const { projectContributors } = useProject({ projectId: id as string })

  try {
    const currentUser = JSON.parse(localStorage.getItem("pocketbase_auth") as string)
    if (projectContributors.length > 0 && currentUser) {
      const isContributor = projectContributors.filter((contributor) => contributor.id === currentUser.model.id)[0]
      if (!isContributor) {
        throw new Error("You are not a contributor of this project")
      }
    }
  } catch (e) {
    router.push("/404")
  }

  return (
    children
  )
}
