import { Planner } from "@/models/planner.model";

export class PlannerService {
  private Planners: Planner[];

  constructor(initialPlanners: Planner[]) {
    this.Planners = initialPlanners;
  }

  createPlanner(Planner: Planner) {
    // debugger;
    this.Planners.push(Planner);
    return this.Planners;
  }

  updatePlanner(updatedPlanner: Planner) {
    const index = this.Planners.findIndex((a) => a.id === updatedPlanner.id);
    if (index !== -1) {
      this.Planners[index] = {
        ...this.Planners[index],
        ...updatedPlanner
      };
    }
    return this.Planners;
  }

  deletePlanner(id: string) {
    this.Planners = this.Planners.filter((a) => a.id !== id);
    return this.Planners;
  }

  getPlanners() {
    return [...this.Planners];
  }
}
