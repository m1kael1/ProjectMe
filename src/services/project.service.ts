import { client } from "@/db/client";
import { sortByCreated } from "@/lib/utils";
import { Contributor, Project, ProjectExpand, User } from "@/models";
import { findProjectDetails } from "@/repository/project.repository";
import { findUserById } from "@/repository/user.repository";

export type ProjectWithContributors = Project & { contributors: Contributor[] };

const getProjectsByUserId = async (userId: string) => {
  const user = await findUserById(userId);

  if (!user) throw new Error("User not found");

  const projects = user?.expand?.projects
    ?.sort(sortByCreated)
    .map((project: ProjectExpand) => {
      const contributors = project.expand.contributors.map(
        (contributor: Contributor) => {
          return {
            id: contributor.id,
            name: contributor.name,
            avatarUrl: contributor.avatarUrl
          };
        }
      );

      return {
        id: project.id,
        name: project.name,
        progress: project.progress,
        tags: project.tags,
        created: new Date(project.created),
        updated: new Date(project.updated),
        description: project.description,
        contributors
      };
    });

  if (!projects) return [];
  return projects;
};

const createProject = (newProject: any, projects: any, setProjects: any) => {
  return () =>
    new Promise((resolve) => {
      client
        .collection("projects")
        .create(newProject)
        .then((result) => {
          let newContributors: any = [];
          result.contributors.forEach((id: string) => {
            client
              .collection("users")
              .update(id, {
                "projects+": [result.id]
              })
              .then((contibutor) => {
                newContributors = [
                  ...newContributors,
                  {
                    id,
                    name: contibutor.username,
                    avatarUrl: contibutor.avatarUrl
                  }
                ];
                if (newContributors.length === result.contributors.length) {
                  setTimeout(() => {
                    setProjects([
                      {
                        id: result.id,
                        name: result.name,
                        progress: result.progress,
                        tags: result.tags,
                        description: result.description,
                        contributors: newContributors
                      },
                      ...projects
                    ]);
                  }, 1000);
                }
              });
          });
          resolve(result);
        });
    });
};

const getProjectContributors = async (projectId: string) => {
  const contributors = await findProjectDetails(projectId);
  const listContributors: Contributor[] =
    contributors?.expand?.contributors.map((user: User) => {
      return {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl
      };
    });

  if (!contributors) return [];

  return listContributors;
};

const getProjectById = async (projectId: string) => {
  const project = await findProjectDetails(projectId);
  const projectDetails: Project & { contributors?: Contributor[] } = {
    id: project?.id,
    name: project?.name,
    progress: project?.progress,
    tags: project?.tags,
    description: project?.description,
    created: new Date(project?.created),
    updated: new Date(project?.updated),
    createdBy: project?.createdBy,
    contributors: project?.expand?.contributors
  };
  if (!project) throw new Error("Project not found");
  return projectDetails;
};

const updateProject = (
  projectData: any,
  projectId: string,
  setProjectDetails: any,
  contributorsRemove: string[],
  newContributorsAdd: string[]
) => {
  return () =>
    new Promise((resolve) => {
      client
        .collection("projects")
        .update(projectId, projectData, {
          expand: "contributors"
          // fields: "id,name,description,tags,expand"
        })
        .then((result) => {
          if (contributorsRemove.length > 0) {
            contributorsRemove.forEach((id: string) => {
              client.collection("users").update(id, {
                "projects-": [projectId]
              });
            });
          }

          if (newContributorsAdd.length > 0) {
            newContributorsAdd.forEach((id: string) => {
              client.collection("users").update(id, {
                "projects+": [projectId]
              });
            });
          }

          setProjectDetails({
            id: result.id,
            name: result.name,
            tags: result.tags,
            description: result.description,
            contributors: result?.expand?.contributors
          });
          console.log(result);
          resolve(result);
        });
    });
};

const deleteProject = (
  projectId: string,
  removeProject: (id: string) => void
) => {
  return () =>
    new Promise((resolve) => {
      client
        .collection("projects")
        .delete(projectId)
        .then((result) => {
          removeProject(projectId);
          resolve(result);
        });
    });
};

export {
  getProjectsByUserId,
  createProject,
  getProjectContributors,
  getProjectById,
  updateProject,
  deleteProject
};
