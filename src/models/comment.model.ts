import { z } from "zod";
import { User } from "./user.model";

export type Comment = {
  id: string;
  text: string;
  created: Date;
  createdBy: User;
};

export interface CommentExpand extends Comment {
  expand?: {
    createdBy?: User;
  };
}

export const createCommentSchema = z.object({
  text: z
    .string()
    .min(1, { message: "Text is required" })
    .max(1000, { message: "Text is too long" })
});
