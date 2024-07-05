import { cn } from '@/lib/utils'
import { PropsWithChildren } from 'react'

export const NbVariant = ({ children, className }: { className?: string } & PropsWithChildren) => {
  return (
    <div className={cn("border-[0.5px] border-zinc-400 dark:border-white/70 relative shadow-[4px_4px_0px_0px_rgba(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.7)] rounded-xl mr-1 mb-1", className)}>
      {children}
    </div>
  )
}
