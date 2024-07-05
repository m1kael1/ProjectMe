export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  created: Date;
  updated: Date;
  avatarUrl: string;
  avatar: string;
};

export interface UserExpand extends User {
  expand: {
    projects: string[];
  };
}
