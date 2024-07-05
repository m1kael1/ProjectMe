import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

export default function PlaceholderContent({ children, className }: { children?: React.ReactNode, className?: string }) {
  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6 ">
        <div className={cn("flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]  lg:h-[calc(100vh-56px-64px-20px-24px-56px-48px)] overflow-hidden", className)}>
          {
            children ?
              children :
              <div className="flex flex-col relative"><h1 className="font-bold text-lg ">Comming soon</h1> </div>
          }
        </div>
      </CardContent>
      <Toaster position='bottom-right' />
    </Card>
  );
}
