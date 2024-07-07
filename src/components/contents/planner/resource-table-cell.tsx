import React, { FC } from "react";
import { Resource } from "@/models";
import { cn } from "@/lib/utils";
import { TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface ResourceTableCellProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  resourceItem: Resource;
}

const ResourceTableCell: FC<ResourceTableCellProps> = ({
  className,
  resourceItem,
  ...props
}) => {

  return (
    <TableCell className={cn(className, "sticky left-0 z-10 border-y bg-background ")} {...props}>
      <div className="flex items-center space-x-4 ">
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Avatar className="z-10">
                <AvatarImage className="object-cover" src={resourceItem.avatarUrl} />
                <AvatarFallback>{resourceItem.name}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
        {/* <h2>{resourceItem.name}</h2> */}
      </div>
    </TableCell>
  );
};

export default ResourceTableCell;
