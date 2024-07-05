"use client";

import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Planner as PlannerType,

} from "@/models/planner.model";
import { CalendarIcon, EllipsisIcon, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { NbVariant } from "@/components/ui/variant/nb-variant";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { usePbAuth } from "@/providers/auth-provider";
import { useProject } from "@/hooks/use-project";
import { useParams } from "next/navigation";
import { DeletePlanner } from "./delete-planner";
import { useState } from "react";

interface PlannerProps {
  planner: PlannerType;
  resourceId: string;
  columnIndex: number;
}

const CardPlanner: React.FC<PlannerProps> = ({
  planner,
}) => {
  const { id } = useParams()
  const { user: currentUser } = usePbAuth();
  const { projectDetails } = useProject({
    projectId: id as string
  });
  const [isOpened, setIsOpened] = useState<boolean>()

  return (
    <NbVariant className="rounded-xl" >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between p-1">
          <Dialog open={isOpened}>
            <DialogTrigger>
              <EllipsisIcon className="h-4 w-4" />
            </DialogTrigger>
            <DialogContent className="w-fit">
              <Card className="border-none p-0 shadow-none w-fit">
                <CardHeader className="p-0">
                  <CardTitle>{planner.title}</CardTitle>
                  <CardDescription >
                    {
                      planner.link ? <div className="text-sm mt-2">
                        <a href={planner.link} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-600 line-clamp-1 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs">{format(new Date(planner.start), "MMM dd yyyy HH:mm")} -{" "}
                            {format(new Date(planner.end), "MMM dd yyyy HH:mm")}
                          </span>
                        </a>
                      </div> : <div className="text-sm mt-2 flex">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{format(new Date(planner.start), "MMM dd yyyy HH:mm")} -{" "}
                          {format(new Date(planner.end), "MMM dd yyyy HH:mm")}
                        </span>
                      </div>
                    }
                  </CardDescription>
                </CardHeader>
                <Separator className="my-2" />
                <div className="text-sm my-2">{planner.notes}</div>
                {
                  planner.link &&
                  <><Separator /><div className="text-sm mt-2">
                    <a href={planner.link} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-600 line-clamp-1 flex items-center">
                      <Link className="h-4 w-4 mr-1" />
                      <span className="text-xs">{planner.link}
                      </span>
                    </a>
                  </div>
                  </>
                }{
                  currentUser?.id == projectDetails?.createdBy && <div className="flex justify-end">
                    <DeletePlanner plannerId={planner.id} setIsOpened={setIsOpened} />
                  </div>
                }
              </Card>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent
          className={cn("px-2 py-2")}
        >
          <div className="flex flex-col items-center gap-2 text-xs h-full justify-center">
            <div className="font-bold line-clamp-2">{planner.title}</div>
            <div className="line-clamp-3">{planner.notes}</div>
            <div>
              {format(new Date(planner.start), "kk:mm")} -{" "}
              {format(new Date(planner.end), "kk:mm")}
            </div>
          </div>
        </CardContent>
      </Card>
    </NbVariant>
  );
};
export default CardPlanner;
