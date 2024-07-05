import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import React from 'react'

const UserCard = () => {
  return (
    <Card className='h-fit w-full'>
      <CardHeader className='flex flex-row gap-4'>
        <Avatar className='w-16 h-16' >
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <CardTitle>Mikael Djawa</CardTitle>
      </CardHeader>
      <Separator />
      <CardFooter>
      </CardFooter>
    </Card>
  )
}

export default UserCard