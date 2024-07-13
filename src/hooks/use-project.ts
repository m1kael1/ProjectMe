import { Contributor, Project } from "@/models";
import {
  ProjectWithContributors,
  getProjectById,
  getProjectContributors,
  getProjectsByUserId
} from "@/services/project.service";
import { projectStore } from "@/store/project-store";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

export const useProject = ({
  currentUserId,
  projectId
}: {
  currentUserId?: string;
  projectId?: string;
}) => {
  const {
    projects,
    setProjects,
    setProjectContributors,
    projectContributors,
    setProjectDetails,
    projectDetails
  } = useStore(projectStore);
  // const [projectDetails, setProjectDetails] = useState<
  //   Project & { contributors?: Contributor[] }
  // >();

  const [isLoading, setIsLoading] = useState(false);

  async function getProjectsUser(userId: string) {
    setIsLoading(true);
    try {
      const projects: ProjectWithContributors[] = await getProjectsByUserId(
        userId
      );
      setProjects(projects);
    } catch (error: any) {
      console.error("Error fetching projects:", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function getContributorsOnProject(projectId: string) {
    setIsLoading(true);
    try {
      const contributors = await getProjectContributors(projectId);
      setProjectContributors(contributors);
    } catch (error: any) {
      console.error("Error fetching contributors:", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function getProjectDetails(projectId: string) {
    setIsLoading(true);
    try {
      const projectdetails = await getProjectById(projectId);
      // @ts-ignore
      setProjectDetails(projectdetails);
    } catch (error: any) {
      console.error("Error fetching project:", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (currentUserId) {
      if (!projects[0]) {
        getProjectsUser(currentUserId as string);
      }
    }

    if (projectId) {
      getContributorsOnProject(projectId as string);
      getProjectDetails(projectId as string);
    }
  }, [currentUserId, projectId]);

  return {
    projects,
    projectContributors,
    setProjectContributors,
    projectDetails,
    setProjectDetails,
    isLoading
  };
};
