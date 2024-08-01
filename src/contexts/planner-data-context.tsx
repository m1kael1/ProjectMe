import React, { createContext, useContext, useState, ReactNode, FC } from "react";
import { PlannerService, ResourceService } from "../services";
import { Planner, Contributor, Resource } from "../models";

interface DataContextType {
  Planners: Planner[];
  resources: Resource[];
  addPlanner: (Planner: Planner) => void;
  updatePlanner: (Planner: Planner) => void;
  removePlanner: (id: string) => void;
  addResource: (resource: Resource) => void;
  updateResource: (resource: Resource) => void;
  removeResource: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const PlannerDataContextProvider: FC<{
  children: ReactNode;
  initialPlanners: Planner[];
  initialResources: Contributor[];
}> = ({ children, initialPlanners, initialResources }) => {
  const plannerService = useState(new PlannerService(initialPlanners))[0];
  const resourceService = useState(new ResourceService(initialResources))[0];

  // Create a state that will re-render the context when updated
  const [trigger, setTrigger] = useState(false);

  const handleUpdate = () => setTrigger(!trigger); // simple state toggle to trigger re-render

  const contextValue: DataContextType = {
    Planners: plannerService.getPlanners(),
    resources: resourceService.getResources(),
    addPlanner: (Planner) => {
      plannerService.createPlanner(Planner);
      handleUpdate();
    },
    updatePlanner: (Planner) => {
      plannerService.updatePlanner(Planner);
      handleUpdate();
    },
    removePlanner: (id) => {
      plannerService.deletePlanner(id);
      handleUpdate();
    },
    addResource: (resource) => {
      resourceService.addResource(resource);
      handleUpdate();
    },
    updateResource: (resource) => {
      resourceService.updateResource(resource);
      handleUpdate();
    },
    removeResource: (id) => {
      resourceService.removeResource(id);
      handleUpdate();
    }
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a PlannerDataContextProvider");
  }
  return context;
};
