"use client";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
import { Progress } from "@/components/ui/progress";
import { useProject } from "@/hooks/use-project";
import { useParams } from "next/navigation";
import { TagsBadge } from "../project/project-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import CardPlanner from "../planner/card-planner";
import { usePlanner } from "@/hooks/use-planner";
import { usePbAuth } from "@/providers/auth-provider";
import { useMemo } from "react";
import { format } from "date-fns";
import { useTask } from "@/hooks/use-task";
import { TaskCard } from "../todo/task-card";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardContent = () => {
  const { id } = useParams()
  const { user: currentUser } = usePbAuth();
  const { projectContributors, projectDetails, isLoading } = useProject({
    projectId: id.toString()
  })
  const { listPlanners } = usePlanner({
    projectId: id.toString(),
  })
  const { tasks } = useTask(id.toString())

  const filterPlanners = useMemo(() => {
    return listPlanners?.filter((planner) => (
      planner?.resourceId === currentUser?.id && new Date(planner?.start).toDateString() === new Date().toDateString()
    ))
  }, [listPlanners])

  const filterTaks = useMemo(() => {
    return tasks?.filter((task) => (
      task.for.id === currentUser?.id
    ))
  }, [tasks])

  return (<>{
    isLoading ? <DashboardSkeleton /> : <section className="w-full flex flex-col justify-space-between h-full overflow-auto">
      <div>
        <div className="md:flex justify-between">
          <h1 className="text-3xl font-bold">{projectDetails?.name}</h1>
          <p className="my-4">Last updated: {projectDetails?.updated.toDateString()}</p>
        </div>
        <div>
          <div className="mt-2"><TagsBadge tags={projectDetails?.tags} /></div>
          <p className="mt-2 text-slate-600">{projectDetails?.description}</p>
        </div>
        <Progress className="mt-4 h-3" color="bg-green-500" value={projectDetails?.progress} />
        <div className="flex -gap-4 mt-4">
          <AnimatedTooltip items={projectContributors} />
        </div>
      </div>
      <Separator className="mt-4" />
      <div>
        <h3 className="my-4 text-xl font-bold">Your Schedule Today</h3>
        <ScrollArea >
          <div className="flex gap-4 ">
            {
              filterPlanners.length === 0 ? <>No Schedule Today</> :
                filterPlanners.map((planner) => {
                  const plannerActive = format(new Date(planner.start), "kk:mm") <= format(new Date(), "kk:mm") && format(new Date(planner.end), "kk:mm") >= format(new Date(), "kk:mm")

                  return (
                    <div key={planner.id} className="w-52 mb-2">
                      <CardPlanner planner={planner} plannerActive={plannerActive} />
                    </div>
                  )
                }
                )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Separator className="mt-4" />
      <div>
        <h3 className="my-4 text-xl font-bold">Your Task</h3>
        <ScrollArea >
          <div className="flex gap-4 ">
            {
              filterTaks.length === 0 ? <>No Task</> :
                filterTaks.map((task) => {
                  const isCompleted = task.columnId === "done"
                  return (
                    <div key={task.id} className="w-52 mb-2">
                      <TaskCard task={task} isCompleted={isCompleted} />
                    </div>
                  )
                }
                )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  }
  </>
  )
}

const DashboardSkeleton = () => {
  return (
    <section className="w-full flex flex-col justify-space-between h-full overflow-auto">
      <Skeleton className="h-6 max-w-xl w-full" />
      <div>
        <div className="flex gap-3">
          <Skeleton className="h-4 max-w-36 w-full mt-4" />
          <Skeleton className="h-4 max-w-36 w-full mt-4" />
          <Skeleton className="h-4 max-w-36 w-full mt-4" />
        </div>
        <Skeleton className="h-4  w-full mt-4" />
        <Skeleton className="h-4 w-full mt-4" />
        <Skeleton className="h-4  w-full mt-4" />
        <Skeleton className="h-4 max-w-2xl w-full mt-4" />
        <div className="flex ">
          <Skeleton className="h-16 w-16 rounded-full mt-4" />
          <Skeleton className="h-16 w-16 rounded-full mt-4 -ml-4" />
          <Skeleton className="h-16 w-16 rounded-full mt-4 -ml-4" />
        </div>
        <Skeleton className="h-4 w-full my-4" />{
          Array.from({ length: 2 }).map((_, i) => <div key={i}>
            <Skeleton className="h-4 max-w-xs w-full my-4" />
            <div className="flex gap-4">
              <Skeleton className="h-32 max-w-xs w-full my-4" />
              <Skeleton className="h-32 max-w-xs w-full my-4" />
              <Skeleton className="h-32 max-w-xs w-full my-4" />
            </div>
          </div>)
        }


      </div>
    </section>
  )
}

