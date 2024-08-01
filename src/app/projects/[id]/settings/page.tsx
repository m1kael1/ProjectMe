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
import { EditProjectForm } from "@/components/contents/project/settings.tsx/edit-project-form";

type Props = {
  params: {
    id: string
  }
}

export default function ProjectSettings(props: Props) {
  return (
    <ContentLayout title="Project Settings">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/projects/${props.params.id}/dashboard`}>Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Project Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PlaceholderContent>
        <EditProjectForm projectId={props.params.id} />
      </PlaceholderContent>
    </ContentLayout>
  );
}
