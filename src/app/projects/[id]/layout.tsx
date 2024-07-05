import { AuthMiddleware, ProjectMiddleware } from "@/components/auth/middleware";
import DashboardPanelLayout from "@/components/dashboard-panel/dashboard-panel-layout";

export default function ProjectLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AuthMiddleware>
    <DashboardPanelLayout>
      <ProjectMiddleware>
        {children}
      </ProjectMiddleware>
    </DashboardPanelLayout>
  </AuthMiddleware>
}
