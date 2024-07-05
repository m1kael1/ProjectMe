import { Contributor } from "@/models";
import { ProjectWithContributors } from "@/services/project.service";
import { create } from "zustand";

type ProjectStore = {
  projects: ProjectWithContributors[];
  projectContributors: Contributor[];
  setProjects: (projects: ProjectWithContributors[]) => void;
  setProjectContributors: (projectContributors: Contributor[]) => void;
};

export const projectStore = create<ProjectStore>((set) => ({
  projects: [],
  projectContributors: [],
  
  setProjects: (projects: ProjectWithContributors[]) =>
    set((state) => ({ ...state, projects: projects })),

  setProjectContributors: (projectContributors: Contributor[]) =>
    set((state) => ({ ...state, projectContributors: projectContributors }))
}));
