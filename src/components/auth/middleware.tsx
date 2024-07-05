"use client"

import { useProject } from '@/hooks/use-project'
import { useParams, useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect } from 'react'

export const AuthMiddleware = (props: PropsWithChildren) => {
  const currentUser = localStorage.getItem("pocketbase_auth")
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push("/signin")
    }
  }, [currentUser])

  return (
    props.children
  )
}

export const ProjectMiddleware = (props: PropsWithChildren) => {
  const currentUser = JSON.parse(localStorage.getItem("pocketbase_auth") as string)
  const { id } = useParams()
  const { projectContributors } = useProject({ projectId: id as string })
  const router = useRouter()

  if (projectContributors.length > 0) {
    const isContributor = projectContributors.filter((contributor) => contributor.id === currentUser?.model?.id)[0]
    console.log(isContributor)
    if (!isContributor) {
      router.push("/404")
    }
  }

  return (
    props.children
  )
}
