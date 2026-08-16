import type { Metadata } from "next";

import { LeadsPageClient } from "@/components/dashboard/lead/leads-page-client";
import { ProjectsPageClient } from "@/components/dashboard/project/ProjectClientPage";

export const metadata: Metadata = {
  title: "Projects | Acme CRM",
  description: "Manage your projects efficiently.",
};

export default function ProjectsPage() {
  return (
    <div className="p-4 sm:p-6">
      <ProjectsPageClient />
    </div>
  );
}
