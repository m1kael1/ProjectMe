// export type resourceType = | "room"| "person"| "equipment"| "service"| "other";

import { Contributor } from "./project.model";

export interface Resource extends Contributor {
  // id: string;
  // name: string;
  //   type: resourceType;
  // details: {[key:string]:any};
}
