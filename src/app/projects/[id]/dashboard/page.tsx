import Link from "next/link";
import PlaceholderContent from "@/components/contents/placeholder-content";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import UserCard from "@/components/contents/user/user-card";
import { NbVariant } from "@/components/ui/variant/nb-variant";

export default function DashboardPage() {

  return (
    <ContentLayout title="Dashboard">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PlaceholderContent >
        {/* <div className=" w-full grid grid-cols-3 gap-4">
          <NbVariant className='rounded-xl grid justify-center items-center mb-2 h-80'>
            <ScrollArea className="w-full h-full ">
              <UserCard />
              <UserCard />
              <UserCard />
              <UserCard />
              <UserCard />
              <UserCard />
              <UserCard />
              <UserCard />
              <UserCard />
            </ScrollArea>
          </NbVariant>
        </div> */}
      </PlaceholderContent>
    </ContentLayout>
  );
}
