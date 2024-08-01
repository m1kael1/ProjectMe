import PlaceholderContent from "@/components/contents/placeholder-content";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import ProjectGrid from "@/components/contents/project/project-grid";
import { AddProjectDialog } from "@/components/contents/project/add-project-dialog";
import { ProjectList } from "@/components/contents/project/project-list";
import { AuthMiddleware } from "@/components/auth/middleware";

export default function ListProjectsPage() {
  return (
    <AuthMiddleware>
      <ContentLayout title="All Projects">
        <AddProjectDialog />
        <PlaceholderContent>
          <ProjectGrid>
            <ProjectList />
          </ProjectGrid>
        </PlaceholderContent>
      </ContentLayout>
    </AuthMiddleware>
  );
}
