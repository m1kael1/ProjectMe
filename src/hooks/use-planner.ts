import { client } from "@/db/client";
import { plannerStore } from "@/store/planner-store";
import { useEffect } from "react";
import { useStore } from "zustand";

type UsePlannerProps = {
  projectId: string;
};

export const usePlanner = ({ projectId }: UsePlannerProps) => {
  const { listPlanners, setListPlanners } = useStore(plannerStore);

  const getPlanners = async (projectId: string) => {
    const res = await client.collection("planners").getFullList({
      filter: `project="${projectId}"`,
      keepalive: true,
      cache: "no-cache"
    });

    let plannersByResource = [];

    if (res.length === 0) {
      setListPlanners([]);
    }

    res.forEach((planner: any) => {
      planner.resources.forEach((resource: any) => {
        plannersByResource.push({
          id: planner.id,
          title: planner.title,
          link: planner.link,
          resourceId: resource,
          notes: planner.notes,
          start: new Date(planner.start),
          end: new Date(planner.end)
        });

        if (planner.resources.length === plannersByResource.length) {
          setListPlanners(plannersByResource);
        }
      });
    });
  };

  useEffect(() => {
    getPlanners(projectId);
  }, [projectId]);

  return {
    listPlanners,
    setListPlanners
  };
};
