'use client';

import React, { FC, useEffect } from "react";
import CalendarToolbar from "./planner-toolbar";
import CardPlanner from "./card-planner";
import { Planner as PlannerType, Resource } from "@/models";
import {
  PlannerDataContextProvider,
  useData,
} from "@/contexts/planner-data-context";
import { PlannerProvider, useCalendar } from "@/contexts/planner-context";
import { Timeline } from "./timeline";
import { Table, TableBody, TableRow } from "@/components/ui/table";
import ResourceTableCell from "./resource-table-cell";
import { calculateNewDates, filterPlanners } from "@/lib/utils";
import DropTableCell from "./drop-table-cell";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { usePlanner } from "@/hooks/use-planner";
import { useParams } from "next/navigation";

export interface PlannerProps extends React.HTMLAttributes<HTMLDivElement> {
  initialResources: Resource[];
  initialPlanners: PlannerType[];
}

const Planner: React.FC<PlannerProps> = ({
  initialResources,
  initialPlanners,
  ...props
}) => {
  return (
    <PlannerDataContextProvider
      initialPlanners={initialPlanners}
      initialResources={initialResources}
    >
      <PlannerProvider>
        <PlannerMainComponent {...props} />
      </PlannerProvider>
    </PlannerDataContextProvider>
  );
};

export interface PlannerMainComponentProps
  extends React.HTMLAttributes<HTMLDivElement> { }

const PlannerMainComponent: FC<PlannerMainComponentProps> = ({ ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <CalendarToolbar />
      <CalendarContent {...props} />
    </div>
  );
};

interface CalendarContentProps extends React.HTMLAttributes<HTMLDivElement> { }
const CalendarContent: React.FC<CalendarContentProps> = ({ ...props }) => {
  const { viewMode, dateRange, timeLabels } = useCalendar();
  const { resources, Planners, updatePlanner } = useData();
  const { id } = useParams()
  const { listPlanners } = usePlanner({
    projectId: id as string
  })

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0]?.data;
        const sourceData = source.data;

        if (!destination || !sourceData) return;

        const Planner = Planners.find(
          (planner) => planner.id === sourceData.PlannerId,
        );
        if (!Planner) return;

        const newResource = resources.find(
          (res: Resource) => res.id === destination.resourceId,
        );
        if (!newResource) return;

        const newDates = calculateNewDates(
          viewMode,
          destination.columnIndex as unknown as number,
          sourceData.columnIndex as unknown as number,
          {
            from: Planner.start,
            to: Planner.end,
          },
        );

        updatePlanner({
          ...Planner,
          start: newDates.start as Date,
          end: newDates.end as Date,
          resourceId: newResource.id,
        });
      },
    });
  }, [Planners, listPlanners]);

  return (
    <div className="flex h-[calc(72vh_-_theme(spacing.16))] flex-col">
      <div className="calendar-scroll flex-grow overflow-scroll">
        <Table>
          <Timeline />
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <ResourceTableCell resourceItem={resource} />
                {timeLabels?.map((label, index) => (
                  <DropTableCell
                    resourceId={resource.id}
                    columnIndex={index}
                    key={index}
                  >
                    {listPlanners
                      .filter(
                        (planner) =>
                          filterPlanners(
                            planner,
                            index,
                            dateRange,
                            viewMode,
                          ) && planner.resourceId === resource.id,
                      )
                      .sort((a, b) => a.start.getTime() - b.start.getTime())
                      .map((planner, index) => (

                        <CardPlanner
                          planner={planner}
                          key={index}
                        />
                      ))}
                  </DropTableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Planner;
