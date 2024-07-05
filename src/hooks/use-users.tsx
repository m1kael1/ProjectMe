import { client } from '@/db/client'
import { User } from '@/models'
import React, { useEffect, useState } from 'react'

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>()

  async function getAllUsers() {
    const users: User[] = await client.collection("users").getFullList({
      sort: "-created",
      cache: "no-cache",
      fields: "id,email,avatar,name",
      keepalive: true,
      expand: "projects",
    })
    setUsers(users)
    console.log(users)
    return users
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  return { users }
}
