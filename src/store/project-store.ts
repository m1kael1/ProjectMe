import { Contributor } from "@/models";
import { ProjectWithContributors } from "@/services/project.service";
import { create } from "zustand";

type ProjectStore = {
  projects: ProjectWithContributors[];
  projectContributors: Contributor[];
  setProjects: (projects: ProjectWithContributors[]) => void;
  setProjectContributors: (projectContributors: Contributor[]) => void;
  deleteProject: (projectId: string) => void;
  updateProject: (projectId: string, data: any) => void;
};

export const projectStore = create<ProjectStore>((set) => ({
  projects: [],
  projectContributors: [],

  setProjects: (projects: ProjectWithContributors[]) =>
    set((state) => ({ ...state, projects: projects })),

  setProjectContributors: (projectContributors: Contributor[]) =>
    set((state) => ({ ...state, projectContributors: projectContributors })),

  deleteProject: (projectId: string) =>
    set((state) => ({
      ...state,
      projects: state.projects.filter((project) => project.id !== projectId)
    })),

  updateProject: (projectId: string, data: any) =>
    set((state) => ({
      ...state,
      projects: state.projects.map((project) =>
        project.id === projectId ? { ...project, ...data } : project
      )
    }))
}));
