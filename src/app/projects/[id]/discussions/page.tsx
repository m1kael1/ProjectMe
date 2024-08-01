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
import { DiscussionContent } from "@/components/contents/discussion/discasion-content";
import { DiscussionTopic } from "@/components/contents/discussion/discussion-topic";

interface Props {
  params?: {
    id?: string
  },
  searchParams?: {
    topic?: string
  }
}

export default async function DiscussionsPage(props: Props) {
  return (
    <ContentLayout title="Discussions">
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
              <Link href={`/projects/${props?.params?.id}/dashboard`}>Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Discussions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PlaceholderContent>
        <section className="flex flex-col-reverse gap-4 justify-end w-full lg:flex-row">
          <DiscussionContent topic={props?.searchParams?.topic as string} />
          <DiscussionTopic projectId={props?.params?.id as string} />
        </section>
      </PlaceholderContent>
    </ContentLayout>
  );
}
