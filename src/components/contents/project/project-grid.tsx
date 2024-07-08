import React from 'react'

interface ProjectGridProps {
  children: React.ReactNode
}

const ProjectGrid = ({ children }: ProjectGridProps) => {
  return (
    <section className='container grid grid-cols-1 p-0 h-fit gap-4 md:grid-cols-2 w-full xl:grid-cols-3'>{children}</section>
  )
}

export default ProjectGrid