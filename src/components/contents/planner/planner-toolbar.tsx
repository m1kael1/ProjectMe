import React, { useEffect, useState } from "react";
import { useCalendar } from "@/contexts/planner-context";
import { cn } from "@/lib/utils";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { endOfDay, endOfWeek, startOfWeek } from "date-fns";
import AddPlannerDialog from "./add-planner-dialog";
import { useParams } from "next/navigation";
import { useProject } from "@/hooks/use-project";
import { usePbAuth } from "@/providers/auth-provider";

interface CalendarToolbarProps extends React.HTMLAttributes<HTMLDivElement> { }

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  className,
  ...props
}) => {
  const { setDateRange } = useCalendar();
  const { user: currentUser } = usePbAuth()
  const { id } = useParams()
  const { projectDetails } = useProject({
    projectId: id as string
  });

  const [range, setRange] = useState<DateRange>({
    from: startOfWeek(new Date(), {
      locale: { options: { weekStartsOn: 1 } },
    }),
    to: endOfWeek(new Date()),
  });
  const handleDateRangeUpdate = (range: DateRange) => {
    const from = range.from;
    const to = range.to ?? endOfDay(range.from as Date);
    setDateRange({
      from: from,
      to: to
    });
  };
  useEffect(() => {
    setDateRange(range);
  }, [range]);

  return (
    <div
      className={cn("flex items-center justify-end space-x-2", className)}
      {...props}
    >{
        currentUser?.id == projectDetails?.createdBy ? <AddPlannerDialog /> : null
      }
      <DateRangePicker
        onUpdate={(value) => handleDateRangeUpdate(value.range)}
        initialDateFrom={range.from}
        initialDateTo={range.to}
        align="start"
        showCompare={false}
      />
    </div>
  );
};

export default React.memo(CalendarToolbar);
