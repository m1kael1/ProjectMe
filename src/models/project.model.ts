import { z } from "zod";

export type Project = {
  id: string;
  name: string;
  description?: string;
  progress: number;
  created: Date;
  updated: Date;
  createdBy: string;
  tags?: string;
};

export type Contributor = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type ProjectExpand = {
  expand: {
    contributors: Contributor[];
  };
} & Project;

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name is too long" }),
  description: z.string().optional(),
  contributors: z.array(z.string(), {
    required_error: "Contributors are required"
  }),
  tags: z.string().optional()
});

export const updateProjectSchema = createProjectSchema;
