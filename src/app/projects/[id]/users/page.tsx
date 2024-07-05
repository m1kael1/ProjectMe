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
import ProjectGrid from "@/components/contents/project/project-grid";
import UserCard from "@/components/contents/user/user-card";
import { AuthMiddleware } from "@/components/auth/middleware";

export default function TagsPage() {
  return (
    <ContentLayout title="Users">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PlaceholderContent >
        <ProjectGrid>
          {
            Array.from({ length: 9 }).map((_, i) => (
              <UserCard key={i} />
            ))
          }
        </ProjectGrid>
      </PlaceholderContent>
    </ContentLayout>
  );
}
