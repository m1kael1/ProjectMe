import { create } from "zustand";

type Planner = {
  id: string;
  title: string;
  link: string;
  resourceId: string;
  notes: string;
  start: Date;
  end: Date;
};

type PlannerStore = {
  listPlanners: Planner[];
  setListPlanners: (planners: Planner[]) => void;

  deletePlanner: (plannerId: string) => void;
};

export const plannerStore = create<PlannerStore>((set) => ({
  listPlanners: [],

  setListPlanners: (planners: Planner[]) =>
    set((state) => ({ ...state, listPlanners: planners })),

  deletePlanner: (plannerId: string) =>
    set((state) => ({
      ...state,
      listPlanners: state.listPlanners.filter(
        (planner) => planner.id !== plannerId
      )
    }))
}));
