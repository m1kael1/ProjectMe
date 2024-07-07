"use client";

import React, { useState, useTransition } from "react";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createPlannerSchema,
} from "@/models/planner.model";
import { useData } from "@/contexts/planner-data-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/ui/time-picker";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { Contributor } from "@/models";
import { usePlanner } from "@/hooks/use-planner";
import { useParams } from "next/navigation";
import { client } from "@/db/client";

const AddPlannerDialog: React.FC = () => {
  const { resources } = useData();
  const [isOpened, setIsOpened] = useState(false);
  const [isPending, startAddPlannerTransition] = useTransition();
  const { id } = useParams();
  const { listPlanners, setListPlanners } = usePlanner({
    projectId: id as string,
  });

  const resourcesList = resources.map((contributor: Contributor) => {
    return { label: contributor.name, value: contributor.id }
  })

  const form = useForm<any>({
    resolver: zodResolver(createPlannerSchema),
    defaultValues: {
      title: "",
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
      resourceId: [],
      link: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<any>) {
    const newPlanner = (plannerId: string, resourceId: string) => {
      return {
        id: plannerId,
        title: values.title,
        start: new Date(values.start),
        end: new Date(values.end),
        link: values.link,
        notes: values.notes,
        resourceId: resourceId,
      }
    };

    startAddPlannerTransition(() => {
      let plannerByResource: any[] = [];
      toast.promise(() => new Promise((resolve) => {
        client.collection("planners").create(
          {
            title: values.title,
            link: values.link,
            notes: values.notes,
            start: values.start,
            end: values.end,
            project: id,
            resources: values.resourceId
          }
        ).then((result) => {
          client.collection("projects").update(id as string, {
            "planners+": [result.id]
          })
          values.resourceId.forEach((resourceId: string, index: number) => {
            plannerByResource = [newPlanner(result.id, resourceId), ...plannerByResource];
            if (values.resourceId.length === index + 1) {
              resolve(
                setListPlanners([...listPlanners, ...plannerByResource])
              );
            }
          });
        });

      }),
        {
          loading: "Adding Planner",
          success: "Planner added",
          error: "Failed to add Planner",
        },
      );
      form.reset();
    });
    setTimeout(() => {
      setIsOpened(false);
    }, 1000);
  }

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="w-4 h-4 " />
        </Button>
      </DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <DialogTitle>Add Planner</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Planner title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Planner link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea className="max-h-24" placeholder="Planner notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-left">Start</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP HH:mm:ss")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <FormMessage />
                    <PopoverContent className="w-auto">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="border-t border-border p-3">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-left">End</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP HH:mm:ss")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="border-t border-border p-3">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resourceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource</FormLabel>
                  <FormControl>{
                    resources.length === 0 ? <span>No resource found</span>
                      : <MultiSelect
                        options={resourcesList}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Select contributors"
                        variant="inverted"
                        animation={2}
                        maxCount={3}
                      // {...field}
                      />
                  }
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlannerDialog;
