import { z } from "zod";

export interface Planner {
  id: string;
  title: string;
  start: Date;
  end: Date;
  link?: string;
  notes?: string;
  resourceId: string;
}

export const updatePlannerSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title is too long" }),
  start: z.date(),
  end: z.date(),
  notes: z.string().optional(),
  link: z.string().optional()
});

export const createPlannerSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: "Title is required" })
      .max(50, { message: "Title is too long" }),
    start: z.date(),
    end: z.date(),
    resourceId: z.array(z.string()).min(1, {
      message: "At least one resource is required"
    }),
    notes: z.string().optional(),
    link: z.string().optional()
  })
  .refine((data) => data.end.getTime() >= data.start.getTime(), {
    message: "End date must be after start date",
    path: ["end"] // This helps to focus the error message on the end date field
  });
