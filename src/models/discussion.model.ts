import { z } from "zod";
import { Comment } from "./comment.model";
import { User } from "./user.model";

export type Discussion = {
  id: string;
  title: string;
  created: Date;
  createdBy: string;
  description: string;
  updated: Date;
  image: string;
};

export interface DiscussionExpand extends Discussion {
  expand?: {
    createdBy?: User;
    comments?: Comment[];
  };
}

export const creatDiscussionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title is too long" }),
  description: z.string().min(1, { message: "Description is required" }),
  image: z.string().optional()
});
